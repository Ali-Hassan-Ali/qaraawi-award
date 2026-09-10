/* بوابة التقديم — جائزة الشيخ إبراهيم بن عثمان القرعاوي
   منطق الخطوات الأربع (تعمل بالكامل في المتصفح، بدون أي اتصال خلفي) */
(function () {
  "use strict";

  var form = document.getElementById("portalForm");
  if (!form) return;

  var TOTAL_STEPS = 4;
  var currentStep = 1;
  var otpSent = false;
  var uploadedFiles = [];

  var steps = form.querySelectorAll(".portal-step");
  var pills = document.querySelectorAll("[data-step-indicator]");
  var prevBtn = document.getElementById("prevBtn");
  var nextBtn = document.getElementById("nextBtn");
  var submitBtn = document.getElementById("submitBtn");

  /* ---------- عرض الخطوة الحالية ---------- */
  function renderStep() {
    steps.forEach(function (s) {
      s.classList.toggle("is-active", Number(s.dataset.step) === currentStep);
    });
    pills.forEach(function (p) {
      var n = Number(p.dataset.stepIndicator);
      p.classList.toggle("is-active", n === currentStep);
      p.classList.toggle("is-done", n < currentStep);
    });
    prevBtn.disabled = currentStep === 1;
    var isLast = currentStep === TOTAL_STEPS;
    nextBtn.hidden = isLast;
    submitBtn.hidden = !isLast;
    if (isLast) populateReview();
    window.scrollTo({ top: form.offsetTop - 110, behavior: "smooth" });
  }

  /* ---------- التحقق من صحة كل خطوة قبل المتابعة ---------- */
  function validateStep(step) {
    if (step === 1) {
      var idField = document.getElementById("fieldNationalId");
      var otpField = document.getElementById("fieldOtp");
      var idVal = document.getElementById("nationalId").value.trim();
      var otpVal = document.getElementById("otp").value.trim();
      var idOk = /^\d{10}$/.test(idVal);
      var otpOk = otpSent && /^\d{4,6}$/.test(otpVal);
      idField.classList.toggle("has-error", !idOk);
      otpField.classList.toggle("has-error", !otpOk);
      return idOk && otpOk;
    }
    if (step === 2) {
      var picked = form.querySelector('input[name="track"]:checked');
      document.getElementById("trackError").style.display = picked ? "none" : "block";
      return !!picked;
    }
    if (step === 3) {
      var ok = uploadedFiles.length > 0;
      document.getElementById("uploadError").style.display = ok ? "none" : "block";
      return ok;
    }
    return true;
  }

  nextBtn.addEventListener("click", function () {
    if (!validateStep(currentStep)) return;
    if (currentStep < TOTAL_STEPS) {
      currentStep++;
      renderStep();
    }
  });

  prevBtn.addEventListener("click", function () {
    if (currentStep > 1) {
      currentStep--;
      renderStep();
    }
  });

  /* ---------- الخطوة 1: إرسال رمز التحقق (محاكاة) ---------- */
  var sendOtpBtn = document.getElementById("sendOtpBtn");
  var otpStatus = document.getElementById("otpStatus");
  sendOtpBtn.addEventListener("click", function () {
    var idVal = document.getElementById("nationalId").value.trim();
    if (!/^\d{10}$/.test(idVal)) {
      document.getElementById("fieldNationalId").classList.add("has-error");
      return;
    }
    document.getElementById("fieldNationalId").classList.remove("has-error");
    otpSent = true;
    sendOtpBtn.disabled = true;
    sendOtpBtn.textContent = "تم الإرسال";
    otpStatus.textContent = "تم إرسال رمز التحقق إلى جوالك المسجل (تجريبي: 123456).";
    setTimeout(function () {
      sendOtpBtn.disabled = false;
      sendOtpBtn.textContent = "إعادة الإرسال";
    }, 4000);
  });

  /* ---------- الخطوة 2: اختيار المسار ---------- */
  var trackOptions = document.querySelectorAll(".track-option");
  trackOptions.forEach(function (opt) {
    var input = opt.querySelector("input");
    input.addEventListener("change", function () {
      trackOptions.forEach(function (o) { o.classList.remove("is-selected"); });
      opt.classList.add("is-selected");
      document.getElementById("trackError").style.display = "none";
    });
  });

  /* ---------- الخطوة 3: رفع المستندات ---------- */
  var uploadBox = document.getElementById("uploadBox");
  var fileInput = document.getElementById("fileInput");
  var uploadList = document.getElementById("uploadList");

  uploadBox.addEventListener("click", function () { fileInput.click(); });
  ["dragenter", "dragover"].forEach(function (evt) {
    uploadBox.addEventListener(evt, function (e) {
      e.preventDefault();
      uploadBox.classList.add("is-dragover");
    });
  });
  ["dragleave", "drop"].forEach(function (evt) {
    uploadBox.addEventListener(evt, function (e) {
      e.preventDefault();
      uploadBox.classList.remove("is-dragover");
    });
  });
  uploadBox.addEventListener("drop", function (e) {
    handleFiles(e.dataTransfer.files);
  });
  fileInput.addEventListener("change", function () {
    handleFiles(fileInput.files);
    fileInput.value = "";
  });

  function handleFiles(fileList) {
    Array.prototype.forEach.call(fileList, function (file) {
      uploadedFiles.push(file);
      var li = document.createElement("li");
      var sizeKb = Math.round(file.size / 1024);
      li.innerHTML =
        '<span>' + escapeHtml(file.name) + " (" + sizeKb + " ك.ب)</span>" +
        '<button type="button">إزالة</button>';
      li.querySelector("button").addEventListener("click", function () {
        var idx = uploadedFiles.indexOf(file);
        if (idx > -1) uploadedFiles.splice(idx, 1);
        li.remove();
      });
      uploadList.appendChild(li);
    });
    if (uploadedFiles.length) document.getElementById("uploadError").style.display = "none";
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  /* ---------- الخطوة 4: المراجعة ---------- */
  function populateReview() {
    document.getElementById("reviewNationalId").textContent =
      document.getElementById("nationalId").value.trim() || "—";
    var picked = form.querySelector('input[name="track"]:checked');
    document.getElementById("reviewTrack").textContent = picked ? picked.value : "—";
    document.getElementById("reviewFiles").textContent = String(uploadedFiles.length);
  }

  /* ---------- الإرسال النهائي ---------- */
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) return;

    var trackingNumber =
      "QA-2026-" + String(Math.floor(100000 + Math.random() * 900000));
    document.getElementById("trackingNumber").textContent = trackingNumber;

    document.querySelector('.portal-step[data-step="4"] h2').hidden = true;
    document.querySelector('.portal-step[data-step="4"] .step-desc').hidden = true;
    document.querySelectorAll(".review-block").forEach(function (b) { b.hidden = true; });
    document.getElementById("successState").hidden = false;
    document.getElementById("portalNav").hidden = true;
    document.getElementById("stepper").hidden = true;

    window.scrollTo({ top: form.offsetTop - 110, behavior: "smooth" });
  });

  /* ---------- نسخ رقم المتابعة ---------- */
  document.getElementById("copyTrackingBtn").addEventListener("click", function (e) {
    var txt = document.getElementById("trackingNumber").textContent;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(txt).then(function () {
        e.target.textContent = "تم النسخ";
        setTimeout(function () { e.target.textContent = "نسخ"; }, 2000);
      });
    }
  });

  renderStep();
})();
