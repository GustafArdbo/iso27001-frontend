"use client";

import { FormEvent, useState } from "react";
import DemoHeader from "@/components/DemoHeader";
import { createDemoRequest } from "@/lib/demoRequests";

type SubmitStatus = "idle" | "loading" | "success" | "error";

export default function FormPage() {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const selectedMaterials = formData.getAll("materials").map(String);

    const payload = {
      company: String(formData.get("company") ?? ""),
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      country: String(formData.get("country") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      size: String(formData.get("size") ?? ""),
      message: String(formData.get("message") ?? ""),
      materials: selectedMaterials,
    };

    try {
      setStatus("loading");
      setErrorMessage("");

      await createDemoRequest(payload);

      setStatus("success");
      form.reset();
    } catch (error) {
      console.error(error);
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  return (
      <>
        <DemoHeader />

        <main className="container">
          <section className="card request-card">
            <div className="request-header">
              <p className="eyebrow">ISO27001 readiness support</p>

              <span className="highlight-pill">
              <svg
                  className="pill-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
              >
                <path
                    d="M4 5h16v14H4V5Z"
                    stroke="currentColor"
                    strokeWidth="2"
                />
                <path
                    d="M8 9h8M8 13h8M8 17h5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
              </svg>
              Request analysis material
            </span>

              <h1>Start your ISO 27001 readiness request</h1>

              <p className="hero-copy">
                Tell us a little about your organization and we’ll send the intake
                material needed to begin your ISO27001 readiness or gap analysis.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="row">
                <label>
                  Company name
                  <input
                      type="text"
                      name="company"
                      placeholder="ACME Ltd"
                      required
                  />
                </label>

                <label>
                  Contact name
                  <input
                      type="text"
                      name="name"
                      placeholder="Jane Doe"
                      required
                  />
                </label>
              </div>

              <div className="row">
                <label>
                  Email
                  <input
                      type="email"
                      name="email"
                      placeholder="security@acme.com"
                      required
                  />
                </label>

                <label>
                  Country
                  <select name="country" defaultValue="Sweden (+46)">
                    <option>Sweden (+46)</option>
                    <option>United States (+1)</option>
                    <option>United Kingdom (+44)</option>
                    <option>Germany (+49)</option>
                    <option>Denmark (+45)</option>
                    <option>Norway (+47)</option>
                    <option>Finland (+358)</option>
                  </select>
                </label>
              </div>

              <label>
                Phone
                <input type="tel" name="phone" placeholder="555 123 4567" />
              </label>

              <p className="feedback">
                Choose a country so the email includes the international dialing
                code.
              </p>

              <label>
                Company size
                <select name="size" defaultValue="1-10">
                  <option>1-10</option>
                  <option>11-50</option>
                  <option>51-200</option>
                  <option>201-500</option>
                  <option>500+</option>
                </select>
              </label>

              <fieldset>
                <legend>What would you like help with?</legend>

                <label className="checkbox-row">
                  <input
                      type="checkbox"
                      name="materials"
                      value="standard-forms"
                  />
                  ISO27001 readiness intake form
                </label>

                <label className="checkbox-row">
                  <input type="checkbox" name="materials" value="checklist" />
                  ISMS preparation checklist
                </label>

                <label className="checkbox-row">
                  <input type="checkbox" name="materials" value="gap-analysis" />
                  Gap analysis request template
                </label>
              </fieldset>

              <label>
                Message / Notes
                <textarea
                    name="message"
                    placeholder="Any particular concerns or scope details?"
                />
              </label>

              <div className="actions">
                <button type="submit" disabled={status === "loading"}>
                  {status === "loading" ? "Sending..." : "Request forms"}
                </button>

                <button type="reset" className="muted">
                  Clear
                </button>
              </div>

              {status === "success" && (
                  <p className="feedback">
                    Request sent successfully. We’ll get back to you shortly.
                  </p>
              )}

              {status === "error" && <p className="feedback">{errorMessage}</p>}
            </form>
          </section>
        </main>

        <footer id="contact" className="site-footer">
          <div className="container footer-grid">
            <div>
              <p className="footer-title">ComplyPilot</p>
              <p>
                Helping businesses prepare for ISO27001 with clear, practical
                support.
              </p>
            </div>

            <div>
              <p className="footer-title">Contact</p>
              <p>Email: hello@complypilot.com</p>
              <p>Phone: +1 555 123 4567</p>
              <p>Address: 12 Security Lane, Stockholm, Sweden</p>
            </div>
          </div>
        </footer>
      </>
  );
}