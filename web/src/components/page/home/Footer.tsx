import Strings from "@/constants/Strings"
import Newsletter from "../../component/Newsletter"

export default function Footer() {
  return (
    <footer className="bg-black">
      {/* The upper section */}
      <section className="mb-10 flex flex-col overflow-hidden lg:flex-row">
        {/* Developer's note */}
        <div className="overflow-hidden bg-white/15 px-8 font-roboto md:-ml-16 md:skew-x-[-30deg] md:pl-28 md:pr-32">
          <div className="md:skew-x-[30deg]">
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

        <Newsletter className="md:ml-12" />
      </section>
      {/* Quick Links section */}
      <section className="flex flex-row flex-wrap gap-10 items-stretch justify-start px-12 md:pt-20 pb-20">
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
