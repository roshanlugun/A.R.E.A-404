(function () {
  emailjs.init("AdY3AxPADXg54hwFF");
})();

function fun() {
  hideOtherElements();
  const formContainer = createFormContainer();
  const form = createForm();
  formContainer.appendChild(form);
  document.getElementById("main_div").appendChild(formContainer);
  requestAnimationFrame(() => {
    formContainer.style.opacity = "1";
    formContainer.style.transform = "translate(-50%, 0)";
  });
}

function hideOtherElements() {
  document.getElementById("harvest").style.top = "200px";
  document.getElementById("main_inner").style.backgroundColor = "transparent";
  document.getElementById("harvest").style.opacity = "0";
  document.getElementById("hub").style.display = "none";
  document.getElementById("sign_up").style.display = "none";
}

function createFormContainer() {
  const container = document.createElement("div");
  Object.assign(container.style, {
    minHeight: "500px",
    width: "950px",
    backgroundColor: "orange",
    position: "absolute",
    top: "100px",
    left: "50%",
    transform: "translate(-50%, 20px)",
    opacity: "0",
    transition: "opacity 0.9s ease, transform 0.9s ease",
    borderRadius: "15px",
    padding: "30px",
    boxSizing: "border-box",
    zIndex: "999"
  });

  const heading = document.createElement("h1");
  heading.textContent = "Enter required details";
  heading.style.color = "white";
  heading.style.marginBottom = "30px";
  container.appendChild(heading);
  return container;
}

function createForm() {
  const form = document.createElement("form");
  form.style.position = "relative";
  const fields = [
    { label: "First Name", id: "firstName", top: 80, left: 100, color: "white" },
    { label: "Last Name", id: "lastName", top: 80, left: 460, color: "lightblue" },
    { label: "Email", id: "email4", top: 165, left: 100, color: "lightgreen" },
    { label: "Create User ID", id: "userId", top: 165, left: 460, color: "white" },
    { label: "Phone Number", id: "phone", top: 250, left: 300, color: "white", labelLeft: 400 }
  ];

  fields.forEach(f => {
    const div = document.createElement("div");
    const label = document.createElement("label");
    label.textContent = f.label;
    label.htmlFor = f.id;
    label.style.cssText = `color:${f.color}; font-weight:bold; position:absolute; left:${f.labelLeft ?? f.left}px; top:${f.top}px`;

    const input = document.createElement("input");
    input.type = f.id === "email4" ? "email" : "text";
    input.id = f.id;
    input.required = true;
    Object.assign(input.style, {
      position: "absolute",
      left: `${f.left}px`,
      top: `${f.top + 20}px`,
      padding: "7px",
      width: "300px",
      border: "1px solid red",
      borderRadius: "5px"
    });

    div.appendChild(label);
    div.appendChild(input);
    form.appendChild(div);
  });

  const submitBtn = document.createElement("button");
  submitBtn.textContent = "Send OTP";
  submitBtn.type = "submit";
  Object.assign(submitBtn.style, {
    padding: "8px 20px",
    border: "none",
    backgroundColor: "white",
    color: "orange",
    fontWeight: "bold",
    cursor: "pointer",
    borderRadius: "5px",
    position: "absolute",
    left: "400px",
    top: "340px"
  });

  const message = document.createElement("div");
  message.id = "message";
  message.style.cssText = "margin-top: 15px; position: absolute; top: 380px; left: 350px";

  submitBtn.addEventListener("click", function (e) {
    e.preventDefault();
    sendEmail(message, form);
  });

  form.appendChild(submitBtn);
  form.appendChild(message);
  return form;
}

function sendEmail(messageElement, form) {
  const emailInput = document.getElementById("email4").value;
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailPattern.test(emailInput)) {
    alert("Please enter a valid email address!");
    return;
  }

  const otp = Math.floor(100000 + Math.random() * 900000);
  const templateParams = {
    user_email: emailInput,
    otp_code: otp
  };

  // Save OTP and timestamp in localStorage (5 min validity)
  const expiryTime = new Date().getTime() + 5 * 60 * 1000;
  localStorage.setItem("otp", JSON.stringify({ code: otp.toString(), expiresAt: expiryTime }));

  emailjs.send("service_slz1plj", "template_uql3xs8", templateParams)
    .then(() => {
      alert("OTP Sent");
      form.reset();
      window.location.href = "otp.html";
    })
    .catch(error => {
      alert("FAILED to send OTP");
      console.error(error);
    });
}

function moveFocus(current, nextId) {
  if (current.value.length === current.maxLength) {
    document.getElementById(nextId).focus();
  }
}

function handleBackspace(event, prevId, currentId) {
  if (event.key === "Backspace") {
    const currentField = document.getElementById(currentId);
    if (!currentField.value) {
      document.getElementById(prevId).focus();
    }
  }
}

function submitOTP() {
  const otp = [];
  for (let i = 1; i <= 6; i++) {
    otp.push(document.getElementById(`otp${i}`).value);
  }

  if (otp.includes("")) {
    alert("Please enter all 6 digits of the OTP.");
    return;
  }

  const enteredOTP = otp.join('');
  const saved = JSON.parse(localStorage.getItem("otp"));

  if (!saved) {
    alert("OTP expired or not found.");
    return;
  }

  const now = new Date().getTime();
  if (now > saved.expiresAt) {
    localStorage.removeItem("otp");
    alert("OTP expired. Please request a new one.");
    return;
  }

  if (enteredOTP === saved.code) {
    alert("OTP matched");
    localStorage.removeItem("otp"); // Clean up
    window.location.href = "cp.html";
    // window.location.href = "success.html";
  } else {
    alert("OTP did not match");
  }
}

function resendOTP() {
  alert("OTP has been resent to your mobile number or Gmail!");
}
