# Phân tích prompt trong 2675.mp4 và bộ prompt triển khai MANUL

Nguồn: 43,23 giây, 1080 x 1920, tiếng Nhật. Thời điểm là ước lượng gần đúng.

## 1. Các phần đọc được trực tiếp (KHÔNG phải toàn văn prompt gốc)

### 00:10–00:11 | ChatGPT | Nhân vật

Các dòng nhìn rõ:

> 添付した現在のマヌルネコ風キャラクター画像をベースにしてください。
>
> キャラクターの基本コンセプトである、
>
> ・マヌルネコらしい丸く平たい顔
>
> ・小さく低い位置にある耳
>
> ・太く、丸く、ふっくらしたシルエット

Dịch: Hãy lấy ảnh mèo Manul đang đính kèm làm cơ sở; giữ khuôn mặt tròn bẹt, tai nhỏ ở vị trí thấp, dáng dày, tròn, mềm mập. Các dòng tiếp theo không đọc được đủ để xác nhận màu khăn, phông nền hay các tiêu chuẩn khác có nằm trong prompt gốc.

### 00:18–00:19 | Màn hình trình tạo video AI | Prompt kỹ thuật

Đoạn đọc được:

> キャラクターそのものをCSSで動かす mouse-following animation ではありません。マウス座標によって、元動画から抽出した適切なフレームを選択し、Canvas上に表示するフレームベースのカーソル追従です。最初から、元動画→WebP連番抽出→プリロード→Canvas→カーソル座標→targetFrame→滑らかなフレーム補間、という方式で完成させ、video.currentTime を使った動画スクラブ方式には変更しないでください。

Dịch: Không dùng CSS để di chuyển nhân vật. Dùng tọa độ chuột để chọn khung hình tương ứng đã tách sẵn từ video, hiển thị trên Canvas; chuỗi xử lý là video → WebP → preload → Canvas → tọa độ chuột → frame mục tiêu → nội suy mượt; không chuyển sang tua video bằng video.currentTime.

**Phân tích:** đoạn này mang tính chỉ đạo lập trình trang web, không phải prompt lý tưởng để yêu cầu mô hình video dựng chuyển động. Tác giả có thể đã dán nhầm, dùng chung mẫu, hoặc video dựng cắt nhanh; từ hình ảnh không thể biết chính xác. Để sản xuất ổn định phải tách prompt tạo chuyển động khỏi prompt xây dựng website.

### 00:30–00:31 | Codex/Claude Code | Kiểm định website

Phần văn bản thấy được bắt đầu giữa chừng, không phải đầu prompt:

> フレームを再生成していない、video.currentTime によるリアルタイム追従ではない、Canvas 上で連番画像を表示している、必要なフレームが事前に読み込まれている、カーソル中央 → 正面、下 → 下、左下 → 左下、左 → 左、左上 → 左上、上 → 上、右上 → 右上、右 → 右、右下 → 右下、中間位置でも自然な中間フレームになる、カーソルを止めると対応する方向で止まる、連続して動かしてもカクつかない、フレームが飛ぶような切り替えになっていない、キャラクターのサイズ・位置・背景・構図が変わっていない、UI がキャラクターを邪魔していない...

Dịch: đảm bảo không tái tạo frame lúc runtime; không realtime-seek video; Canvas hiển thị dãy hình và preload trước; các hướng tương ứng center/down/down-left/left/up-left/up/up-right/right/down-right; ở giữa phải có frame trung gian tự nhiên; ngừng chuột thì đứng yên ở hướng đó; chuyển tiếp không giật/nhảy; kích thước, vị trí, nền, bố cục không đổi; UI không đè mascot.

Cũng thấy thêm yêu cầu đặt CTA gần phần diễn giải, cao hơn status bar, không đè lên chữ hoặc nhân vật, toàn trang tối giản và cao cấp; cuối prompt lặp lại yêu cầu về Canvas/WebP và cấm `video.currentTime` scrubbing.

**Không thể xác nhận:** công cụ đã chạy qua bao nhiêu lần sửa, có dùng nguồn code sẵn, kích thước asset, code cụ thể, chính xác câu lệnh tạo video, hay prompt bị che ở đầu và giữa.

## 2. Prompt A — tạo ảnh nhân vật bằng ChatGPT Image

Đây là **PROMPT TÁI DỰNG**, không phải nguyên văn video. Upload một ảnh mèo Manul tham khảo đã có quyền sử dụng rồi dán:

```text
Create a production-ready original 3D mascot of a Pallas's cat (manul) using the attached image ONLY as a reference for the animal's natural anatomy, not to copy someone else's existing artwork.

ART DIRECTION:
- A small, extremely fluffy manul with a broad, rounded flat-looking face, tiny low-set rounded ears, prominent cheeks, thick dense fur and a compact plump silhouette.
- A chunky hand-knitted muted denim-blue scarf wrapped naturally around its neck, one tail hanging to its right side.
- Stylized cinematic 3D rendering with realistic tactile fur and yarn, adorable but physically coherent proportions; fine visible whiskers.
- Neutral, alert, inquisitive eyes directed exactly at camera.
- Soft studio key light from camera-left, warm subtle rim light, smooth shadows, no harsh highlights.
- Waist-up portrait with full head, ears, shoulders and scarf in frame; room above ears. Fixed camera at eye level, 70mm portrait-lens feel.
- SOLID single-color muted slate-blue background with no patterns, objects or text. Center the character so it can be extracted onto a site hero. 4:5 portrait crop.
- Keep every characteristic of the mascot consistent for subsequent angles: face structure, fur markings, scarf weave, eye color, nose, ears, lighting and exposure.

NEGATIVE:
No human body, no hats, no additional accessories, no second character, no captions, no logos, no text, no photomontage, no deformed limbs, no duplicated whiskers, no inconsistent eyes, no extra tails, no motion blur.

Generate ONE clean canonical neutral/front-view character reference. Do not generate the website or a collage.
```

## 3. Prompt B — tạo bộ tư thế / nguồn video chuyển động

**PROMPT TÁI DỰNG**: sau khi có ảnh chuẩn ở Prompt A, gửi cùng ảnh đó tới mô hình tạo video có hỗ trợ ảnh làm đầu vào. Nên tạo các đoạn riêng cho hướng chuyển động, không dựa vào một video lộn xộn.

```text
Animate ONLY the Pallas's cat from the supplied canonical reference. Fixed, locked camera and exact same framing throughout; solid muted slate-blue background. The cat remains seated and the body, chest, scarf silhouette, lighting and camera do not move.

The cat gradually turns its head and shifts its eye gaze through distinct poses: straight ahead, look up, upper right, right, lower right, down, lower left, left, upper left, then return to straight ahead. Spend a clear held beat on each direction so sharp, clean keyframes can be exported. Gentle believable head/eye motion, minimal natural blinking only between key poses. No camera move, pan, zoom, dolly, perspective jump, body position change, tail wagging, scarf motion, character redesign, or cuts. Identity and proportions must stay perfectly consistent.

Prioritize clean pose fidelity over elaborate motion. Avoid crossfading, motion blur, depth-of-field shifts and background variation. Single unbroken shot, 16:9 horizontal output, highest accessible resolution.
```

**Quy tắc quan trọng:** video dài/AI video đơn lẻ có thể không tạo chính xác đủ chín hướng; nếu mô hình không tuân thủ, xuất thành chín clip/keyframe với các ảnh tham chiếu đầu/cuối, rồi chọn 25 pose theo ma trận 5 x 5 để đạt chuyển tiếp trung gian. Dùng camera và nền giống nhau ở mọi ảnh.

## 4. Prompt C — triển khai bằng Codex

**PROMPT TÁI DỰNG hoàn chỉnh**: mở thư mục chứa repository `motion-site` rồi dán trong Codex:

```text
You are a senior creative frontend engineer. Work in this local motion-site repository. Before writing code, inspect README.md, index.html, style.css, script.js and assets/poses. Preserve the existing functional experience and improve it. Do not merely describe implementation: edit actual files, run checks and report concrete results.

GOAL:
Recreate the premium Japanese MANUL landing-page interaction from the supplied demo: a fluffy Pallas's cat in a blue knitted scarf reacts to the user's pointer. Use responsive, accessible frontend code. The aesthetic is editorial Japanese typography + deep blue background, restrained lighting and highly polished motion.

MANDATORY ANIMATION ARCHITECTURE:
1. NEVER rotate, skew, or translate the final mascot with CSS to fake tracking. Never use a seek-based video.currentTime mouse scrubber.
2. Use discrete source images exported as WebP, normalized to identical pixel dimensions, background, head location and overall composition.
3. Preload all poses into memory. Draw on a single HTML Canvas 2D context.
4. Map pointer coordinates to targetX and targetY in [-1,1], where left/right/up/down and diagonals select the proper pose.
5. Smooth target changes with requestAnimationFrame using frame-rate-independent exponential damping.
6. Between pose samples, bilinearly blend the four surrounding frames to avoid abrupt jumps. Keep canvas framing and character size identical in every pose. Handle unavailable frames gracefully.
7. When mouse stops, retain the chosen direction. When pointer exits, ease back to neutral. On mobile, support touch and explicit direction controls. Honor prefers-reduced-motion.
8. Use one Canvas as the sole visible mascot layer. Avoid flicker, visible cuts, coordinate inversion, interaction latency, browser console errors and layout shifts.

DESIGN:
- Desktop: editorial navigation/header; large headline 'その動き、見てます。' on left; dominant cat on right; a contrasting rounded '目を合わせる' CTA adjacent to explanatory copy; discrete bottom status bar and scroll cue.
- The CTA must remain above the status bar, not overlap text or the mascot.
- Mobile: legible headline, accessible navigation and controls, attractive mascot composition, no horizontal overflow.
- Add usable EN/JP switch, working anchors, accessible focus styles, semantically structured content and a working pose demo.

PERFORMANCE / QUALITY:
- Load hero pose promptly. Load and decode frame assets. Keep source WebP sizes reasonable.
- Use ResizeObserver and devicePixelRatio-corrected canvas backing size.
- Use no paid API at runtime. Do not introduce unnecessary dependencies.
- If a set of TRUE multi-directional frames is not present, clearly label the prototype limitation in README. NEVER claim image-warped still poses are genuine 3D head turns.
- Run JavaScript syntax checks and whatever browser/end-to-end checks the environment supports. Report which checks actually ran and any blockers.

OUTPUT:
Implement changes in this repository, preserve a one-command local start, ensure static hosting works, then write a concise verification report and the exact steps to deploy on Vercel. Do not replace the prototype with a generic template or a static screenshot.
```

## 5. Prompt D — Codex kiểm thử nghiêm ngặt

```text
Act as a skeptical frontend QA lead. Open this local motion-site repository and test it rather than rewriting it blindly. Inspect actual code and assets. Test desktop 1440x900, tablet 820x1180, mobile 390x844, slow 3G, reduced motion and keyboard-only navigation. Exercise 9 cursor directions, intermediate positions, stationary cursor, pointer exit, repeated fast cursor movement, browser resize, i18n, CTA and mobile menu.

Strictly check: frame preload completes; correct left/right/up/down direction; bilinear interpolation is smooth; no video.currentTime scrubbing; no CSS mascot tracking transform; character alignment and identity remain stable; CTA is fully clickable; no text overlap; canvas responds on high-DPR screens; no page errors or horizontal overflow.

Produce a table PASS/FAIL/NOT VERIFIED with evidence and file:line references. Fix confirmed defects, rerun tests, and list unresolved issues plainly. Never claim production-ready multi-angle 3D motion while the assets are synthesized from a still image.
```

## 6. Phân biệt công nghệ demo và mã nguồn bản dựng

- **Video gốc:** nhiều góc nhìn của mascot được mô tả bằng video → trích WebP; không có file video gốc hoặc chuỗi frame từ tác giả được chia sẻ trong 2675.mp4.
- **Bản dựng kèm theo:** 25 frame WebP *thực sự tồn tại*, nhưng được tạo bằng phép biến dạng 2D rất nhẹ từ một ảnh mascot mới. Bộ giải mã, tải trước, Canvas, nội suy 2D, tọa độ chuột, responsive và tương tác vẫn dùng kiến trúc thật như video.
- Muốn đạt fidelity giống demo, bước còn thiếu là thay toàn bộ các frame mô phỏng bằng ảnh đa góc chân thật; không chỉ tăng số frame hoặc độ phân giải.
