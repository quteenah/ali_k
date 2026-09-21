// ==========================================
// أداة محاكي Termux Simulator
// ==========================================
window.openTermuxService = function () {
  if (typeof window.openServiceModal !== "function") return;

  window.openServiceModal(
    "💻 Termux Simulator",
    `
    <div style="background:#050a0f; color:#00ff66; font-family: monospace; padding: 12px; border-radius: 8px; height: 350px; display: flex; flex-direction: column; text-align: left; direction: ltr; border: 1px solid #00ffaa44;">
      <div id="termuxOutput" style="flex: 1; overflow-y: auto; font-size: 13px; line-height: 1.4; white-space: pre-wrap;">
<span style="color:#00d9ff;">Welcome to Termux Simulator (v0.118)</span>
Working directory: /data/data/com.termux/files/home

Type <span style="color:#ffff00;">help</span> to see available commands.
      </div>
      <div style="display: flex; align-items: center; margin-top: 8px; border-top: 1px solid #224433; padding-top: 8px;">
        <span style="color:#00d9ff; font-weight:bold; margin-right: 6px;">~$</span>
        <input type="text" id="termuxInput" style="flex: 1; background: transparent; border: none; color: #fff; font-family: monospace; outline: none; font-size: 14px;" placeholder="Type a command..." autofocus>
      </div>
    </div>
    `
  );

  setTimeout(() => {
    const input = document.getElementById("termuxInput");
    const output = document.getElementById("termuxOutput");
    input?.focus();

    input?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const cmd = input.value.trim();
        if (!cmd) return;

        output.innerHTML += `\n<span style="color:#00d9ff;">~$</span> ${escapeHtml(cmd)}\n`;
        input.value = "";

        processTermuxCommand(cmd, output);
        output.scrollTop = output.scrollHeight;
      }
    });
  }, 100);
};

function processTermuxCommand(cmd, output) {
  const lower = cmd.toLowerCase();

  if (lower === "help") {
    output.innerHTML += `<span style="color:#aaaaaa;">
Available Commands:
 - <span style="color:#00ffaa;">help</span>        : Show help message
 - <span style="color:#00ffaa;">pkg install [x]</span>: Simulate package install
 - <span style="color:#00ffaa;">ls</span>          : List files
 - <span style="color:#00ffaa;">neofetch</span>    : Display system info
 - <span style="color:#00ffaa;">clear</span>       : Clear terminal screen
 - <span style="color:#00ffaa;">banner</span>      : Show ASCII art
 - <span style="color:#00ffaa;">whoami</span>      : Print user
</span>`;
  } else if (lower.startsWith("pkg install") || lower.startsWith("apt install")) {
    const pkgName = cmd.split(" ")[2] || "package";
    output.innerHTML += `<span style="color:#ffff00;">Reading package lists... Done</span>
<span style="color:#00ffaa;">Unpacking ${pkgName}... Done!</span>\n`;
  } else if (lower === "ls") {
    output.innerHTML += `<span style="color:#00d9ff;">storage</span>   <span style="color:#00ff00;">script.py</span>   README.md\n`;
  } else if (lower === "clear") {
    output.innerHTML = "";
  } else if (lower === "neofetch") {
    output.innerHTML += `<span style="color:#00ffaa;">OS: Termux Android (Simulated)</span>\n`;
  } else if (lower === "whoami") {
    output.innerHTML += `u0_a248\n`;
  } else {
    output.innerHTML += `<span style="color:#ff5555;">bash: ${escapeHtml(cmd)}: command not found</span>\n`;
  }
}

function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
