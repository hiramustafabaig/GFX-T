import { closingCta } from "@/data/company";
import { contact, mailto } from "@/lib/site";
import { ActionLink } from "@/components/buttons/ActionLink";
import { RevealText } from "@/components/typography/RevealText";
import { SectionLabel } from "@/components/typography/SectionLabel";
import { SelectionBox } from "@/components/ui/SelectionBox";
import { FormStage } from "@/three/FormStage";

/**
 * STILL THINKING? — the closing frame. The hero's field returns and lifts back into the GFX-T
 * nib as the section arrives, so the site ends where it began. The one question in the
 * headline carries the hero's selection box.
 */
export function ClosingCta() {
  return (
    <section aria-labelledby="closing-heading" className="relative isolate min-h-svh overflow-hidden bg-ink-950">
      <div className="absolute inset-0 -z-10 [mask-image:linear-gradient(180deg,black_0%,black_40%,rgb(0_0_0/0.25)_70%)] lg:[mask-image:linear-gradient(90deg,rgb(0_0_0/0.25)_0%,rgb(0_0_0/0.4)_35%,black_60%)]">
        <FormStage drive="scroll" />
      </div>

      <div className="container-page flex min-h-svh flex-col justify-end pb-12 pt-[40svh] md:pb-16 lg:pt-[var(--spacing-section)]">
        <SectionLabel index="07">Your move</SectionLabel>
        <h2
          id="closing-heading"
          className="mt-8 font-display text-[clamp(3rem,11vw,12rem)] font-bold uppercase leading-[0.86] tracking-[-0.03em]"
        >
          <span className="block">Still</span>
          <span className="relative block w-fit">
            <span className="text-signal [font-variation-settings:'wdth'_122]">Thinking?</span>
            <SelectionBox visible />
          </span>
        </h2>

        <div className="mt-12 grid gap-10 border-t border-ink-800 pt-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <RevealText split="words" className="text-lead text-paper/85">
              {closingCta.body}
            </RevealText>
            <div className="mt-8">
              <ActionLink href="/contact" variant="primary">
                Contact us
              </ActionLink>
            </div>
          </div>
          <address className="grid gap-6 not-italic sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
            <div>
              <p className="label text-ink-400">Email</p>
              <a href={mailto("Project enquiry")} className="mt-2 block text-h3 leading-tight transition-colors hover:text-signal">
                {contact.email}
              </a>
            </div>
            <div>
              <p className="label text-ink-400">Call our CEO</p>
              <a href={contact.ceoPhone.href} className="mt-2 block text-h3 leading-tight transition-colors hover:text-signal">
                {contact.ceoPhone.display}
              </a>
            </div>
          </address>
        </div>
      </div>
    </section>
  );
}
