import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function TermsPage() {
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
        <h1 className="font-serif text-4xl font-bold text-text mb-8">Podmínky užívání</h1>
        
        <div className="bg-surface p-8 rounded-2xl shadow-sm border border-border space-y-6 text-text-secondary">
          <p className="lead text-xl text-text font-serif">
            Vítejte v aplikaci Echo. Používáním naší aplikace souhlasíte s následujícími podmínkami.
          </p>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4 mt-8">1. Úvodní ustanovení</h2>
            <p>
              Tyto podmínky upravují vztah mezi provozovatelem aplikace a jejími uživateli. 
              Aplikace slouží k zaznamenávání nálad, myšlenek a sdílení v komunitě.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4 mt-8">2. Uživatelský účet</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Jste zodpovědní za bezpečnost svého hesla.</li>
              <li>Jste zodpovědní za veškerý obsah, který pod svým účtem zveřejníte.</li>
              <li>Vyhrazujeme si právo zrušit účty, které porušují pravidla komunity.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4 mt-8">3. Pravidla chování</h2>
            <p>
              V naší komunitě dbáme na vzájemný respekt. Je zakázáno:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Šířit nenávistný obsah, rasismus nebo diskriminaci.</li>
              <li>Obtěžovat ostatní uživatele.</li>
              <li>Spamovat nebo šířit škodlivý software.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4 mt-8">4. Ochrana dat</h2>
            <p>
              Vaše data jsou pro nás důležitá. Podrobnosti o tom, jak zpracováváme vaše údaje, 
              naleznete v sekci <Link href="/privacy" className="text-primary hover:underline">Ochrana soukromí</Link>.
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
