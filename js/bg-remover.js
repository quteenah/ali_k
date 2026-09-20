const uploadInput = document.getElementById('uploadInput');
const bgBtn = document.getElementById('bgBtn');
const resultDiv = document.getElementById('result');
const statusText = document.getElementById('status');

bgBtn.addEventListener('click', async () => {
  const file = uploadInput.files[0];
  if (!file) return alert('اختر صورة أولاً');

  bgBtn.disabled = true;
  statusText.innerText = 'جاري إزالة الخلفية محلياً...';

  try {
    const imageBlob = await imglyRemoveBackground(file);
    const url = URL.createObjectURL(imageBlob);
    resultDiv.innerHTML = `<img src="${url}" alt="النتيجة">`;
    statusText.innerText = 'تمت العملية بنجاح!';
  } catch (err) {
    statusText.innerText = 'حدث خطأ أثناء المعالجة.';
  } finally {
    bgBtn.disabled = false;
  }
});
