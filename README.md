# 💾 Interactive Online Bill of Specifications

An interactive web-based platform that allows stakeholders to **dynamically customize project requirements**. This system bridges the gap between clients and developers by providing a transparent, real-time interface for selecting, modifying, and estimating project components — all in one place.

---

## 🚀 Overview

This project was built to simplify and streamline the project planning phase by:

- Allowing users to **select and configure project specifications** in real time
- Displaying **instant cost estimates** based on selected options
- Sending detailed specifications and cost breakdowns via **email**
- Making project planning more **transparent, collaborative, and interactive**

---

## ⚙️ Environment Variables

To make the system work properly with the email PDF function, you need to set the following environment variable:

```env
REACT_APP_FIREBASE_FUNCTION_URL=https://sendemailwithpdf-v3cgkolbxa-uc.a.run.app
```

Place this in a `.env.local` file in the root of the project.

---

## 🛠️ Customizing the Requirements

If you'd like to change the default list of specifications (features, pricing, options, etc.), you can modify the logic in:

```
src/components/steps/*
```

Each step component (`step1.tsx`, `step2.tsx`, etc.) maps to a portion of the form. You can tweak them independently to fit your own project workflow or industry use case.

---

## ⚡️ Getting Started

To run and build the project locally:

```bash
npm install
npm run build
```

This will generate the `.out` folder (static output).

You can then host the project using services like **Vercel** or **Netlify** by deploying the `.out` directory.

---

## 🤝 Contribution

While I’m no longer actively maintaining this project, **contributions are welcome**.

If you'd like to improve the code structure — such as implementing **separation of concerns**, adding architecture layers, or improving clarity — please feel free to **open a Pull Request (PR)**.

Let’s keep it clean for anyone else who finds value in this tool.

---

## 📄 License

[MIT License](./LICENSE) – free to use, modify, and distribute.

---

> _Thanks for checking it out! If it helps your workflow, even better._
