"""Tokyo journal still, built and rendered in Blender (Cycles) from Python. Units: modelled in cm, scaled to metres."""
import bpy, math, os, sys, random
from mathutils import Vector

D = os.path.dirname(os.path.abspath(__file__))
T = lambda f: os.path.join(D, 'tex', f)
ARGS = dict(a.split('=', 1) for a in sys.argv[sys.argv.index('--') + 1:]) if '--' in sys.argv else {}
SAMPLES, RES, OUT = int(ARGS.get('samples', 128)), int(ARGS.get('res', 100)), ARGS.get('out', os.path.join(D, 'render.png'))
random.seed(4)

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
CM = 0.01
def B(x, y, z): return Vector((x * CM, -z * CM, y * CM))      # three.js-style (cm, y-up, z toward camera) -> Blender (m, z-up)
def srgb(h):
    c = [int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    return tuple(v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4 for v in c)

# ------------------------------------------------------------------ materials
def material(name, color=None, img=None, rough=0.8, coat=0.0, sheen=0.0, alpha_img=False, alpha_mul=1.0, transmission=0.0,
             noise_bump=None, wave_edges=False, voronoi_bump=None):
    m = bpy.data.materials.new(name); m.use_nodes = True
    nt = m.node_tree; N, Lk = nt.nodes, nt.links.new; P = N['Principled BSDF']
    P.inputs['Roughness'].default_value = rough
    if color: P.inputs['Base Color'].default_value = (*srgb(color), 1)
    if img:
        tx = N.new('ShaderNodeTexImage'); tx.image = bpy.data.images.load(T(img)); tx.interpolation = 'Cubic'; tx.extension = 'CLIP'
        Lk(tx.outputs['Color'], P.inputs['Base Color'])
        if alpha_img:
            mul = N.new('ShaderNodeMath'); mul.operation = 'MULTIPLY'; mul.inputs[1].default_value = alpha_mul
            Lk(tx.outputs['Alpha'], mul.inputs[0]); Lk(mul.outputs[0], P.inputs['Alpha'])
    if coat: P.inputs['Coat Weight'].default_value = coat; P.inputs['Coat Roughness'].default_value = 0.25
    if sheen: P.inputs['Sheen Weight'].default_value = sheen; P.inputs['Sheen Roughness'].default_value = 0.6
    if transmission: P.inputs['Transmission Weight'].default_value = transmission
    if wave_edges:      # stacked page edges: fine bands in the paper colour
        wv = N.new('ShaderNodeTexWave'); wv.bands_direction = 'Z'; wv.inputs['Scale'].default_value = 900; wv.inputs['Distortion'].default_value = 3
        cr = N.new('ShaderNodeValToRGB'); cr.color_ramp.elements[0].color = (*srgb('#bfb39d'), 1); cr.color_ramp.elements[1].color = (*srgb('#ece3cf'), 1)
        Lk(wv.outputs['Fac'], cr.inputs['Fac']); Lk(cr.outputs['Color'], P.inputs['Base Color'])
    if noise_bump or voronoi_bump:
        if noise_bump:
            scale, strength = noise_bump
            tex = N.new('ShaderNodeTexNoise'); tex.inputs['Scale'].default_value = scale; tex.inputs['Detail'].default_value = 10
            src = tex.outputs['Fac']
        else:
            scale, strength = voronoi_bump
            tex = N.new('ShaderNodeTexVoronoi'); tex.inputs['Scale'].default_value = scale; src = tex.outputs['Distance']
        bp = N.new('ShaderNodeBump'); bp.inputs['Strength'].default_value = strength; bp.inputs['Distance'].default_value = 0.0005
        Lk(src, bp.inputs['Height']); Lk(bp.outputs['Normal'], P.inputs['Normal'])
    return m

def felt_material():
    m = material('felt', rough=0.95, sheen=0.12, noise_bump=(900, 0.5))
    nt = m.node_tree; N = nt.nodes; P = N['Principled BSDF']
    nz = N.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 140; nz.inputs['Detail'].default_value = 12
    cr = N.new('ShaderNodeValToRGB'); cr.color_ramp.elements[0].color = (*srgb('#232326'), 1); cr.color_ramp.elements[1].color = (*srgb('#3a3a3f'), 1)
    nt.links.new(nz.outputs['Fac'], cr.inputs['Fac']); nt.links.new(cr.outputs['Color'], P.inputs['Base Color'])
    return m

# ------------------------------------------------------------------ mesh helpers
def mesh_obj(name, verts, faces, uvs=None, mat=None, smooth=True):
    me = bpy.data.meshes.new(name); me.from_pydata([tuple(v) for v in verts], [], faces); me.update()
    if uvs:
        ul = me.uv_layers.new()
        for poly in me.polygons:
            for li in poly.loop_indices: ul.data[li].uv = uvs[me.loops[li].vertex_index]
    if smooth:
        for p in me.polygons: p.use_smooth = True
    ob = bpy.data.objects.new(name, me); sc.collection.objects.link(ob)
    if mat: me.materials.append(mat)
    return ob

def ensure_up(ob):
    me = ob.data
    if sum(p.normal.z for p in me.polygons) < 0:
        for p in me.polygons: p.flip()
    me.update()

def grid(w, h, nx, ny, zfn, mat, name):
    """flat card w x h (cm) in local XY, height from zfn(u,v) (cm)"""
    verts, uvs, faces = [], [], []
    for j in range(ny + 1):
        for i in range(nx + 1):
            u, v = i / nx, j / ny
            verts.append(Vector(((u - 0.5) * w * CM, (v - 0.5) * h * CM, zfn(u, v) * CM))); uvs.append((u, v))
    for j in range(ny):
        for i in range(nx):
            a = j * (nx + 1) + i; faces.append((a, a + 1, a + nx + 2, a + nx + 1))
    ob = mesh_obj(name, verts, faces, uvs, mat); ensure_up(ob); return ob

def solidify(ob, t_cm):
    m = ob.modifiers.new('solid', 'SOLIDIFY'); m.thickness = t_cm * CM; m.offset = -1

def bevel(ob, w_cm, seg=3):
    m = ob.modifiers.new('bevel', 'BEVEL'); m.width = w_cm * CM; m.segments = seg

# ------------------------------------------------------------------ desk
desk = grid(240, 240, 1, 1, lambda u, v: 0, felt_material(), 'desk')

# ------------------------------------------------------------------ notebook (same profile as the three.js version)
PW, PH, BASE, LIFT = 24.0, 20.0, 0.42, 0.95
def pageY(d): return BASE + LIFT * (1 - math.exp(-d / 1.7)) - 0.05 * (d / PH) ** 2
paper_mat = lambda img: material('page_' + img, img=img, rough=0.88, noise_bump=(700, 0.06))
for top, img in [(True, 'page_top.png'), (False, 'page_bottom.png')]:
    nx, ny = 120, 90; verts, uvs, faces = [], [], []
    for j in range(ny + 1):
        for i in range(nx + 1):
            u, s = i / nx, j / ny; d = s * PH
            verts.append(B((u - 0.5) * PW, pageY(d) + 0.06 * math.sin(math.pi * u) * s, -d if top else d)); uvs.append((u, s if top else 1 - s))
    for j in range(ny):
        for i in range(nx):
            a = j * (nx + 1) + i; faces.append((a, a + 1, a + nx + 2, a + nx + 1))
    ensure_up(mesh_obj('page_top' if top else 'page_bot', verts, faces, uvs, paper_mat(img)))
    # stacked-paper skirts following the profile
    edge = material('edges', wave_edges=True, rough=0.95)
    for sx in (-1, 1):
        pts = [B(sx * PW / 2, pageY(k / 80 * PH), (-1 if top else 1) * k / 80 * PH) for k in range(81)]
        vs = pts + [Vector((p.x, p.y, 0.3 * CM)) for p in pts]
        fs = [(k, k + 1, 81 + k + 1, 81 + k) for k in range(80)]
        mesh_obj('skirt', vs, fs, mat=edge, smooth=False)
    pts = [B((k / 40 - 0.5) * PW, pageY(PH) + 0.06 * math.sin(math.pi * k / 40), (-1 if top else 1) * PH) for k in range(41)]
    vs = pts + [Vector((p.x, p.y, 0.3 * CM)) for p in pts]
    mesh_obj('skirt_end', vs, [(k, k + 1, 41 + k + 1, 41 + k) for k in range(40)], mat=edge, smooth=False)
# leather cover with rounded edges
bpy.ops.mesh.primitive_cube_add(size=1, location=B(0, 0.15, 0)); cov = bpy.context.active_object
cov.scale = ((PW + 1.3) * CM, (PH * 2 + 1.3) * CM, 0.3 * CM); bpy.ops.object.transform_apply(scale=True)
bevel(cov, 0.12, 4); cov.data.materials.append(material('leather', color='#6a2732', rough=0.55, coat=0.15, voronoi_bump=(1400, 0.25)))

def to_world(px, py):
    x = (px - 56) / 968 * PW - PW / 2
    if py < 958: d = (955 - py) / 805 * PH; return x, -d, d
    d = (py - 961) / 809 * PH; return x, d, d
def surfaceY(py): return pageY(abs(to_world(0, py)[1]))

def place(ob, x, y, z, rot_three_y):
    ob.location = B(x, y, z); ob.rotation_euler = (0, 0, rot_three_y)

# ------------------------------------------------------------------ polaroids, tape, ticket
def polaroid(img, px, py, wpx, ang, lift):
    w = wpx / 968 * PW; h = w * 1.18; x, z, _ = to_world(px, py)
    ob = grid(w, h, 24, 24, lambda u, v: 0.16 * max(abs(2 * u - 1), abs(2 * v - 1)) ** 3 + 0.06 * (2 * u - 1) ** 2,
              material('pol_' + img, img=img, rough=0.38, coat=0.3), 'polaroid')
    solidify(ob, 0.06); place(ob, x, lift, z, -ang); return ob
polaroid('pol_kam.png', 214, 862, 236, -0.09, pageY(PH * 0.3) + 0.12)
polaroid('pol_ram.png', 910, 1594, 196, 0.08, surfaceY(1594) + 0.07)

def tape(img, px, py, wpx, hpx, ang, y):
    x, z, _ = to_world(px, py)
    ob = grid(wpx / 968 * PW, hpx / 968 * PW, 40, 8, lambda u, v: 0.018 * math.sin(u * 37 + v * 5) + random.uniform(-0.01, 0.01),
              material('tape_' + img, img=img, rough=0.55, alpha_img=True, alpha_mul=0.86, transmission=0.15), 'tape')
    place(ob, x, y, z, -ang)
tape('washi_pink.png', 150, 1010, 190, 46, -0.62, surfaceY(1010) + 0.03)
tape('washi_yellow.png', 598, 1020, 160, 42, 0.7, surfaceY(1020) + 0.03)
tape('washi_blue.png', 220, 724, 110, 34, 0.1, pageY(PH * 0.3) + 0.2)
tape('washi_green.png', 918, 1482, 110, 34, -0.15, surfaceY(1594) + 0.16)

tk = grid(8.2, 3.5, 2, 2, lambda u, v: 0, material('ticket', img='ticket.png', rough=0.55), 'ticket'); solidify(tk, 0.05)
place(tk, 6.2, 0.06, 21.3, -0.07)

# ------------------------------------------------------------------ markers and mug
def marker(x, z, length, ang, cap_col, label):
    r = 0.72
    root = bpy.data.objects.new('marker', None); sc.collection.objects.link(root)
    body_mat = material('mbody_' + label, img=label, rough=0.3, coat=0.6)
    cap_mat = material('mcap_' + cap_col, color=cap_col, rough=0.25, coat=0.8)
    def cyl(rad, depth, cx, mat, verts=64):
        bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=rad * CM, depth=depth * CM, location=(cx * CM, 0, 0), rotation=(0, math.pi / 2, 0))
        o = bpy.context.active_object; o.data.materials.append(mat); bevel(o, 0.08, 3)
        for p in o.data.polygons: p.use_smooth = True
        o.parent = root; return o
    cyl(r, length * 0.7, -length * 0.15, body_mat)
    cyl(r * 1.06, length * 0.3, length * 0.35, cap_mat)
    bpy.ops.mesh.primitive_torus_add(major_radius=r * 1.07 * CM, minor_radius=0.05 * CM, location=(length * 0.2 * CM, 0, 0), rotation=(0, math.pi / 2, 0))
    ring = bpy.context.active_object; ring.data.materials.append(material('chrome', color='#9a9a9a', rough=0.25)); ring.data.materials[0].node_tree.nodes['Principled BSDF'].inputs['Metallic'].default_value = 1; ring.parent = root
    root.location = B(x, r, z); root.rotation_euler = (0, 0, -ang)
marker(-6, -23.6, 15, 0.05, '#c8322b', 'label_red.png')
marker(7.5, -25.4, 13.5, -0.04, '#e9b52c', 'label_yellow.png')
marker(-6.5, 24.6, 13, -0.06, '#e58aa0', 'label_pink.png')

ceramic = material('ceramic', color='#efeae2', rough=0.18, coat=0.6)
bpy.ops.mesh.primitive_cylinder_add(vertices=96, radius=4.1 * CM, depth=9 * CM, end_fill_type='NOTHING', location=B(15.5, 4.5, -27)); mug = bpy.context.active_object
solidify(mug, 0.35); bevel(mug, 0.1, 3); mug.data.materials.append(ceramic)
for p in mug.data.polygons: p.use_smooth = True
bpy.ops.mesh.primitive_circle_add(vertices=96, radius=3.75 * CM, fill_type='NGON', location=B(15.5, 7.6, -27)); coffee = bpy.context.active_object
coffee.data.materials.append(material('coffee', color='#2a170d', rough=0.05, coat=1.0))
bpy.ops.mesh.primitive_cylinder_add(vertices=96, radius=4.1 * CM, depth=0.35 * CM, location=B(15.5, 0.18, -27)); mug_base = bpy.context.active_object; mug_base.data.materials.append(ceramic)
bpy.ops.mesh.primitive_torus_add(major_radius=2.1 * CM, minor_radius=0.5 * CM, location=B(11.0, 4.6, -27), rotation=(math.pi / 2, 0, 0))
bpy.context.active_object.data.materials.append(ceramic)

# ------------------------------------------------------------------ lights + world
def area(name, loc, size, energy, color, target=(0, 0, 0)):
    ld = bpy.data.lights.new(name, 'AREA'); ld.shape = 'DISK'; ld.size = size; ld.energy = energy; ld.color = color
    ob = bpy.data.objects.new(name, ld); sc.collection.objects.link(ob); ob.location = loc
    ob.rotation_euler = (Vector(target) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler(); return ob
area('key', B(-60, 95, -48), 0.75, float(ARGS.get('key', 260)), (1.0, 0.80, 0.60))
area('fill', B(45, 70, 80), 1.2, float(ARGS.get('fill', 8)), (0.80, 0.86, 1.0))
w = bpy.data.worlds.new('world'); w.use_nodes = True; w.node_tree.nodes['Background'].inputs['Color'].default_value = (0.010, 0.011, 0.013, 1); sc.world = w

# ------------------------------------------------------------------ camera
tilt, dist = math.radians(float(ARGS.get('tilt', 26))), float(ARGS.get('dist', 92))
target = B(0, 0.8, 0.8)
cam_d = bpy.data.cameras.new('cam'); cam = bpy.data.objects.new('cam', cam_d); sc.collection.objects.link(cam); sc.camera = cam
cam.location = target + Vector((0, -math.sin(tilt) * dist * CM, math.cos(tilt) * dist * CM))
cam.rotation_euler = (target - cam.location).to_track_quat('-Z', 'Y').to_euler()
cam_d.sensor_fit = 'VERTICAL'; cam_d.sensor_height = 24; cam_d.lens = 12 / math.tan(math.radians(15))
cam_d.dof.use_dof = True; cam_d.dof.focus_distance = (cam.location - target).length; cam_d.dof.aperture_fstop = float(ARGS.get('fstop', 5.6))

# ------------------------------------------------------------------ render settings
r = sc.render; r.engine = 'CYCLES'; r.resolution_x, r.resolution_y, r.resolution_percentage = 1080, 1920, RES
r.filepath = OUT; r.image_settings.file_format = 'PNG'
cy = sc.cycles; cy.device = 'CPU'
# device=gpu: try OptiX / CUDA (NVIDIA), HIP (AMD), Metal (Apple), oneAPI (Intel); falls back to CPU
if ARGS.get('device', 'cpu').lower() == 'gpu':
    prefs = bpy.context.preferences.addons['cycles'].preferences
    for kind in ('OPTIX', 'CUDA', 'HIP', 'METAL', 'ONEAPI'):
        try:
            prefs.compute_device_type = kind; prefs.get_devices()
            gpus = [d for d in prefs.devices if d.type == kind]
            if gpus:
                for d in prefs.devices: d.use = d.type == kind
                cy.device = 'GPU'; print('rendering on', kind, [d.name for d in gpus]); break
        except Exception:
            continue
    else:
        print('no GPU found, rendering on CPU')
cy.samples = SAMPLES; cy.use_adaptive_sampling = True; cy.adaptive_threshold = 0.02
cy.use_denoising = True; cy.denoiser = 'OPENIMAGEDENOISE'
cy.max_bounces = 8; cy.diffuse_bounces = 3; cy.glossy_bounces = 3; cy.transmission_bounces = 6; cy.transparent_max_bounces = 12
cy.blur_glossy = 1.0; cy.caustics_reflective = cy.caustics_refractive = False
if cy.device == 'CPU': r.threads_mode = 'AUTO'
try:
    vt = ARGS.get('view', 'standard')
    if vt == 'agx': sc.view_settings.view_transform = 'AgX'; sc.view_settings.look = 'AgX - Medium High Contrast'
    else: sc.view_settings.view_transform = 'Standard'; sc.view_settings.look = 'None'
except Exception as e:
    print('colour management fallback:', e)
sc.view_settings.exposure = float(ARGS.get('exposure', 0.0))
bpy.ops.render.render(write_still=True)
print('WROTE', OUT)
