export function Footer() {
  return (
    <footer className="border-t border-chanel-gray-light bg-chanel-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {[
            { title: 'CHANEL', links: ['À propos', 'Carrières', 'Presse'] },
            { title: 'Service', links: ['Contact', 'FAQ', 'Boutiques'] },
            { title: 'Légal', links: ['Mentions légales', 'Confidentialité', 'Cookies'] },
            { title: 'Suivre', links: ['Instagram', 'YouTube', 'WeChat'] },
          ].map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 text-xs uppercase tracking-luxury text-chanel-black">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <span className="text-xs text-chanel-gray transition-colors hover:text-chanel-black cursor-pointer">
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-chanel-gray-light pt-6 text-center">
          <p className="text-xs text-chanel-gray">
            © 2024 CHANEL — Projet d&apos;entraînement technique. Non affilié à CHANEL S.A.S.
          </p>
        </div>
      </div>
    </footer>
  )
}
