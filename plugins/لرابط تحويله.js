import fetch from 'node-fetch';
import { FormData, Blob } from 'formdata-node';
import { fileTypeFromBuffer } from 'file-type';

let handler = async (m, { conn }) => {
  try {
    // التحقق مما إذا كانت الرسالة تحتوي على صورة
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    if (!mime.startsWith('image/')) return conn.reply(m.chat, '🚩 يرجى الرد على *صورة* فقط.', m);

    // تنزيل الصورة من الرسالة
    let media = await q.download();
    
    // رفع الصورة إلى مدري اعتقد نيهيههيqu.ax
    const link = await uploadToQuax(media);

    // إرسال رابط الصورة في طيز السيسي
    let txt = `*» رابط الصورة:* ${link}`;
    await conn.reply(m.chat, txt, m);
    
  } catch (e) {
    console.error(e);
    await conn.reply(m.chat, '🌱 حدث خطأ أثناء رفع الصورة.', m);
  }
};

// دالة لرفع الملف إلى كسم qu.ax
const uploadToQuax = async (buffer) => {
  // شانكس عمك ودزها
  const { ext, mime } = await fileTypeFromBuffer(buffer);
  
  // تجهيز النموذج لتحميل كسم الملف
  const form = new FormData();
  const blob = new Blob([buffer], { type: mime }); // استخدام `buffer` مباشرة
  form.append('files[]', blob, 'tmp.' + ext);

  // إرسال الطلب إلى الموقع الخرا qu.ax
  const res = await fetch('https://qu.ax/upload.php', { method: 'POST', body: form });
  const result = await res.json();

  // الجزء الي يتحقق اذا كانت العملية بنت كلب نجحت
  if (result && result.success) {
    return result.files[0].url;
  } else {
    throw new Error('Failed to upload the file to qu.ax');
  }
};

handler.command = ['لرابط'];
export default handler;
