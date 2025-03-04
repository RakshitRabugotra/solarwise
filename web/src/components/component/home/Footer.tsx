import Strings from "@/constants/Strings"
import Newsletter from "../Newsletter"

export default function Footer() {
  return (
    <footer className="bg-black">
      {/* The upper section */}
      <section className="mb-10 flex flex-col overflow-hidden lg:flex-row">
        {/* Developer's note */}
        <div className="-ml-16 skew-x-[-30deg] overflow-hidden bg-white/15 pl-28 pr-32 font-roboto">
          <div className="skew-x-[30deg]">
            {/* Solarwise branding */}
            <div className="-ml-24 skew-x-[-30deg] bg-white pl-24">
              <div className="skew-x-[30deg]">
                <h1 className="text-4xl py-1 text-black uppercase font-mono font-extrabold">
                  {Strings.APP.SHORT_TITLE}
                </h1>
              </div>
            </div>
            {/* Developer's note main content */}
            <h2 className="mb-1 pt-5 text-3xl font-light text-white">
              {"Developer's Note"}
            </h2>
            <p className="max-w-md text-wrap pb-5 text-justify text-white/60">
              {Strings.DEV_NOTE}
            </p>
          </div>
        </div>
        {/* The newsletter */}

        <Newsletter className="ml-12" />
      </section>
      {/* Quick Links section */}
      <section className="flex flex-row flex-wrap items-stretch justify-start px-12 py-20">
        {Strings.FOOTER_LINKS.map((footerLink, index) => (
          <FooterLink {...footerLink} key={footerLink.title + index} />
        ))}
      </section>
    </footer>
  )
}

const FooterLink = ({ title, links }: (typeof Strings.FOOTER_LINKS)[0]) => {
  return (
    <div className="w-full max-w-xs">
      <h4 className="mb-1 font-medium text-white">{title}</h4>
      <ul className="text-white/60">
        {links.map((link, index) => (
          <li key={link.href + index}>
            <a href={link.href} target="_blank">
              {link.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
