import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors mb-8 group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Zpět na domovskou stránku
      </Link>

      <article className="prose prose-lg prose-slate max-w-none">
        <h1 className="font-serif text-4xl font-bold text-text mb-8">Ochrana soukromí</h1>
        
        <div className="bg-surface p-8 rounded-2xl shadow-sm border border-border space-y-6 text-text-secondary">
          <p className="lead text-xl text-text font-serif">
            Vaše soukromí je pro nás prioritou. Zde se dozvíte, jaká data sbíráme a jak je chráníme.
          </p>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4 mt-8">1. Jaká data sbíráme</h2>
            <p>
              Pro fungování aplikace potřebujeme zpracovávat některé vaše údaje:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Základní profilové údaje (email, uživatelské jméno).</li>
              <li>Obsah, který vytvoříte (příspěvky, komentáře, nálady).</li>
              <li>Technické údaje o zařízení pro zajištění bezpečnosti.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4 mt-8">2. Jak data využíváme</h2>
            <p>
              Vaše data používáme výhradně pro:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Poskytování služby a jejích funkcí.</li>
              <li>Zlepšování uživatelského zážitku.</li>
              <li>Komunikaci s vámi ohledně vašeho účtu.</li>
            </ul>
            <p className="mt-4 font-medium text-text">
              Nikdy neprodáváme vaše osobní údaje třetím stranám.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4 mt-8">3. Vaše práva</h2>
            <p>
              Máte právo kdykoliv:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Požádat o kopii svých dat.</li>
              <li>Požádat o smazání účtu a všech dat (právo být zapomenut).</li>
              <li>Upravit své nastavení soukromí v aplikaci.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4 mt-8">4. Kontakt</h2>
            <p>
              Máte-li dotazy ohledně ochrany soukromí, kontaktujte nás na:
              <a href="mailto:privacy@madison.app" className="text-primary hover:underline ml-1">privacy@madison.app</a>
            </p>
          </section>

          <div className="pt-8 mt-8 border-t border-border/50 text-sm text-text-tertiary">
            Poslední aktualizace: {new Date().toLocaleDateString('cs-CZ')}
          </div>
        </div>
      </article>
    </div>
  );
}
