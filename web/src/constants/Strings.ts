import Images from "./Images"

export default {
  ADDRESS_BAR_PLACEHOLDER: "Enter an Indian address",
  ADDRESS_BAR_SUBMIT_TEXT: "Check my roof",
  APP: {
    SHORT_TITLE: "Solarwise",
    TITLE: "Solarwise — Know your roof",
    DESCRIPTION: "",
  },
  FEATURES: [
    {
      title: "Clean Energy",
      imageSrc: Images.icons.energy,
      description:
        "Solar panels absorb sunlight and convert it into electricity, reducing reliance on fossil fuels and lowering carbon emissions. They harness renewable energy, promoting sustainability and environmental conservation. By generating power without pollution, solar panels support the clean energy motto.",
    },
    {
      title: "Smart Savings",
      imageSrc: Images.icons.savings,
      description:
        "Solar panels reduce electricity bills by generating free energy from sunlight, lowering dependence on grid power. They offer long-term savings through net metering and tax incentives. With minimal maintenance costs and durability, solar panels provide a smart financial investment while promoting sustainability.",
    },
    {
      title: "Safe Future",
      imageSrc: Images.icons.shield,
      description:
        "Solar panels provide clean, renewable energy, reducing greenhouse gas emissions and combating climate change. By decreasing reliance on fossil fuels, they help prevent pollution and environmental hazards. Their sustainable power generation ensures energy security, creating a safer and healthier future for all.",
    },
  ],
  BENEFITS: [
    {
      imageSrc: Images.images.benefits.ai,
      description: "AI based solution too calculate the savings",
    },
    {
      imageSrc: Images.images.benefits.indianFlag,
      description: "Trained on indian dataset",
    },
    {
      imageSrc: Images.images.benefits.speedometer,
      description: "Highly responsive to a set of various inputs.",
    },
  ],
  DEV_NOTE:
    "This webpage is only a project and the rights of the resources belong to their respective owners. The developers don't profit from this website and is only made as a Software Engineering Project.",
  FOOTER_LINKS: [
    {
      title: "Website Docs",
      links: [
        {
          name: "Document",
          href: "https://github.com/RakshitRabugotra/solarwise",
        },
        {
          name: "Github",
          href: "https://github.com/RakshitRabugotra/solarwise",
        },
      ],
    },
    {
      title: "Quick Links",
      links: [
        { name: "Home", href: "/" },
        { name: "Features", href: "/features" },
      ],
    },
    {
      title: "Developes",
      links: [
        {
          name: "Rakshit Rabugotra",
          href: "https://github.com/RakshitRabugotra",
        },
        { name: "Subhajit Das", href: "https://github.com/RakshitRabugotra" },
        { name: "Deepanshu", href: "https://github.com/RakshitRabugotra" },
        { name: "Arjun Singh", href: "https://github.com/RakshitRabugotra" },
      ],
    },
    {
      title: "Socials",
      links: [
        { name: "Instagram", href: "https://instagram.com" },
        { name: "Discord", href: "https://discord.com" },
        { name: "X", href: "https://x.com" },
      ],
    },
  ],
}
