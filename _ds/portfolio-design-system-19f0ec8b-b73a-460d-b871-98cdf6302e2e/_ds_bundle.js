/* @ds-bundle: {"format":4,"namespace":"PortfolioDesignSystem_19f0ec","components":[{"name":"Card","sourcePath":"components/content/Card.jsx"},{"name":"SectionHeading","sourcePath":"components/content/SectionHeading.jsx"},{"name":"Tag","sourcePath":"components/content/Tag.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"},{"name":"NavLink","sourcePath":"components/navigation/NavLink.jsx"}],"sourceHashes":{"components/content/Card.jsx":"d08df1913c5b","components/content/SectionHeading.jsx":"8831572a8cde","components/content/Tag.jsx":"f066ab115458","components/forms/Button.jsx":"1fe94da17bfd","components/forms/Input.jsx":"ff8251bed144","components/forms/Textarea.jsx":"e462b032c39f","components/navigation/NavLink.jsx":"18b5577c8adb","ui_kits/portfolio-website/AboutSection.jsx":"33f2b630ee20","ui_kits/portfolio-website/ContactSection.jsx":"cd001a32e8d5","ui_kits/portfolio-website/Footer.jsx":"f3b8f6c5f991","ui_kits/portfolio-website/Header.jsx":"9eccfeb76622","ui_kits/portfolio-website/Hero.jsx":"7b1765a608d7","ui_kits/portfolio-website/ProjectsSection.jsx":"2f9102e545f0"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.PortfolioDesignSystem_19f0ec = window.PortfolioDesignSystem_19f0ec || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/content/Card.jsx
try { (() => {
function Card({
  children,
  padding = 'lg'
}) {
  const pad = padding === 'sm' ? '16px' : padding === 'md' ? '24px' : '32px';
  return React.createElement('div', {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: pad,
      transition: 'box-shadow var(--duration-base) var(--ease-standard)'
    }
  }, children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Card.jsx", error: String((e && e.message) || e) }); }

// components/content/SectionHeading.jsx
try { (() => {
function SectionHeading({
  eyebrow,
  title,
  align = 'left'
}) {
  return React.createElement('div', {
    style: {
      textAlign: align,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      maxWidth: '680px',
      marginLeft: align === 'center' ? 'auto' : 0,
      marginRight: align === 'center' ? 'auto' : 0
    }
  }, eyebrow && React.createElement('span', {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-label)',
      fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--accent)'
    }
  }, eyebrow), React.createElement('h2', {
    style: {
      fontFamily: 'var(--font-sans)',
      fontWeight: 700,
      fontSize: 'var(--text-h2)',
      lineHeight: 'var(--leading-snug)',
      letterSpacing: 'var(--tracking-h1)',
      color: 'var(--text-heading)',
      margin: 0
    }
  }, title));
}
Object.assign(__ds_scope, { SectionHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/SectionHeading.jsx", error: String((e && e.message) || e) }); }

// components/content/Tag.jsx
try { (() => {
function Tag({
  children,
  tone = 'neutral'
}) {
  const tones = {
    neutral: {
      background: 'var(--ink-1-a08)',
      color: 'var(--text-body)'
    },
    accent: {
      background: 'var(--accent-a08)',
      color: 'var(--accent-press)'
    }
  };
  return React.createElement('span', {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '12px',
      fontWeight: 500,
      letterSpacing: '0.01em',
      padding: '4px 12px',
      borderRadius: 'var(--radius-lg)',
      display: 'inline-block',
      ...tones[tone]
    }
  }, children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Tag.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  onClick,
  type = 'button'
}) {
  const pad = size === 'sm' ? '8px 16px' : size === 'lg' ? '16px 32px' : '12px 24px';
  const fontSize = size === 'sm' ? '14px' : '16px';
  const base = {
    fontFamily: 'var(--font-sans)',
    fontWeight: 600,
    fontSize,
    borderRadius: 'var(--radius-md)',
    padding: pad,
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: '1px solid transparent',
    transition: 'background var(--duration-base) var(--ease-standard), color var(--duration-base) var(--ease-standard), border-color var(--duration-base) var(--ease-standard)',
    opacity: disabled ? 0.45 : 1,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px'
  };
  const variants = {
    primary: {
      background: 'var(--accent)',
      color: 'var(--text-on-accent)'
    },
    secondary: {
      background: 'transparent',
      color: 'var(--accent)',
      border: '1px solid var(--accent)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-body)',
      border: '1px solid var(--border-subtle)'
    }
  };
  const [hover, setHover] = React.useState(false);
  const hoverStyle = !disabled && hover ? variant === 'primary' ? {
    background: 'var(--accent-hover)'
  } : variant === 'secondary' ? {
    background: 'var(--accent-a08)'
  } : {
    background: 'var(--ink-1-a08)'
  } : {};
  return React.createElement('button', {
    type,
    disabled,
    onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      ...base,
      ...variants[variant],
      ...hoverStyle
    }
  }, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function Input({
  label,
  placeholder,
  type = 'text',
  error
}) {
  const [focus, setFocus] = React.useState(false);
  return React.createElement('label', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      fontFamily: 'var(--font-sans)'
    }
  }, label && React.createElement('span', {
    style: {
      fontSize: '14px',
      fontWeight: 500,
      color: 'var(--text-body)'
    }
  }, label), React.createElement('input', {
    type,
    placeholder,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '16px',
      padding: '12px 16px',
      borderRadius: 'var(--radius-sm)',
      border: error ? '1px solid #C0392B' : focus ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
      outline: 'none',
      background: 'var(--surface-card)',
      color: 'var(--text-body)',
      boxShadow: focus ? '0 0 0 3px var(--accent-a16)' : 'none',
      transition: 'border-color var(--duration-base) var(--ease-standard), box-shadow var(--duration-base) var(--ease-standard)'
    }
  }), error && React.createElement('span', {
    style: {
      fontSize: '12px',
      color: '#C0392B'
    }
  }, error));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Textarea.jsx
try { (() => {
function Textarea({
  label,
  placeholder,
  rows = 5
}) {
  const [focus, setFocus] = React.useState(false);
  return React.createElement('label', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      fontFamily: 'var(--font-sans)'
    }
  }, label && React.createElement('span', {
    style: {
      fontSize: '14px',
      fontWeight: 500,
      color: 'var(--text-body)'
    }
  }, label), React.createElement('textarea', {
    placeholder,
    rows,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: '16px',
      lineHeight: 1.6,
      padding: '16px',
      borderRadius: 'var(--radius-sm)',
      border: focus ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
      outline: 'none',
      resize: 'vertical',
      background: 'var(--surface-card)',
      color: 'var(--text-body)',
      boxShadow: focus ? '0 0 0 3px var(--accent-a16)' : 'none',
      transition: 'border-color var(--duration-base) var(--ease-standard)'
    }
  }));
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.jsx", error: String((e && e.message) || e) }); }

// components/navigation/NavLink.jsx
try { (() => {
function NavLink({
  children,
  active = false,
  href = '#'
}) {
  const [hover, setHover] = React.useState(false);
  return React.createElement('a', {
    href,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: '15px',
      fontWeight: 500,
      textDecoration: 'none',
      color: active ? 'var(--accent)' : hover ? 'var(--accent)' : 'var(--text-body)',
      transition: 'color var(--duration-fast) var(--ease-standard)'
    }
  }, children);
}
Object.assign(__ds_scope, { NavLink });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/NavLink.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio-website/AboutSection.jsx
try { (() => {
function AboutSection() {
  const {
    SectionHeading
  } = window.PortfolioDesignSystem_19f0ec;
  return /*#__PURE__*/React.createElement("section", {
    id: "about",
    style: {
      background: 'var(--white)',
      borderTop: '1px solid var(--border-subtle)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: 'var(--space-7) var(--side-margin-mobile)'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "About",
    title: "A little about how I work"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: 'var(--text-base)',
      lineHeight: 'var(--leading-relaxed)',
      color: 'var(--text-body)',
      maxWidth: 680,
      marginTop: 'var(--space-5)'
    }
  }, "I start every engagement with the constraints \u2014 the content, the platform, the team \u2014 and design from there rather than from a mood board. Most of my work sits between product design and front-end implementation, which means what ships usually looks like what was designed."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: 'var(--text-base)',
      lineHeight: 'var(--leading-relaxed)',
      color: 'var(--text-body)',
      maxWidth: 680,
      marginTop: '1.25em'
    }
  }, "Based in Portland, working with teams remotely. Previously at a handful of small product studios.")));
}
window.AboutSection = AboutSection;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio-website/AboutSection.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio-website/ContactSection.jsx
try { (() => {
function ContactSection() {
  const {
    SectionHeading,
    Input,
    Textarea,
    Button
  } = window.PortfolioDesignSystem_19f0ec;
  const [sent, setSent] = React.useState(false);
  return /*#__PURE__*/React.createElement("section", {
    id: "contact",
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: 'var(--space-7) var(--side-margin-mobile) var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "Contact",
    title: "Start a project"
  }), /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      setSent(true);
    },
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)',
      maxWidth: 480,
      marginTop: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Name",
    placeholder: "Ada Lovelace"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Email",
    type: "email",
    placeholder: "you@studio.com"
  }), /*#__PURE__*/React.createElement(Textarea, {
    label: "Message",
    placeholder: "Tell me about your project...",
    rows: 5
  }), /*#__PURE__*/React.createElement("div", null, sent ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      color: 'var(--accent)',
      fontSize: 14
    }
  }, "Thanks \u2014 I'll reply within a day or two.") : /*#__PURE__*/React.createElement(Button, {
    type: "submit"
  }, "Send message"))));
}
window.ContactSection = ContactSection;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio-website/ContactSection.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio-website/Footer.jsx
try { (() => {
function Footer() {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      borderTop: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: 'var(--space-4) var(--side-margin-mobile)',
      display: 'flex',
      justifyContent: 'space-between',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-caption)',
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 Jordan Ecker"), /*#__PURE__*/React.createElement("span", null, "Portland, OR")));
}
window.Footer = Footer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio-website/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio-website/Header.jsx
try { (() => {
function Header({
  active
}) {
  const {
    NavLink,
    Button
  } = window.PortfolioDesignSystem_19f0ec;
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      background: 'var(--surface-page)',
      borderBottom: '1px solid var(--border-subtle)',
      zIndex: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '20px var(--side-margin-mobile)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontWeight: 700,
      fontSize: 18,
      letterSpacing: '-0.01em',
      color: 'var(--text-heading)'
    }
  }, "Jordan Ecker"), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 32,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(NavLink, {
    href: "#work",
    active: active === 'work'
  }, "Work"), /*#__PURE__*/React.createElement(NavLink, {
    href: "#about",
    active: active === 'about'
  }, "About"), /*#__PURE__*/React.createElement(NavLink, {
    href: "#contact",
    active: active === 'contact'
  }, "Contact"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: () => document.getElementById('contact').scrollIntoView({
      behavior: 'smooth'
    })
  }, "Say hello"))));
}
window.Header = Header;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio-website/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio-website/Hero.jsx
try { (() => {
function Hero() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: 'var(--space-8) var(--side-margin-mobile) var(--space-7)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-label)',
      fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--accent)'
    }
  }, "Product designer & developer"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontWeight: 700,
      fontSize: 'var(--text-display)',
      lineHeight: 'var(--leading-tight)',
      letterSpacing: 'var(--tracking-display)',
      color: 'var(--text-heading)',
      margin: '16px 0 0',
      maxWidth: 820
    }
  }, "I design and build clear, considered digital products."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: 'var(--text-lg)',
      lineHeight: 'var(--leading-relaxed)',
      color: 'var(--text-body)',
      maxWidth: 640,
      margin: '24px 0 0'
    }
  }, "Ten years across product design and front-end engineering \u2014 currently taking on a small number of freelance case studies."));
}
window.Hero = Hero;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio-website/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio-website/ProjectsSection.jsx
try { (() => {
const PROJECTS = [{
  title: 'Northwind Rebrand',
  blurb: 'Identity and web system for a logistics platform going public.',
  tags: ['Brand', 'Web', 'Featured']
}, {
  title: 'Aster Health App',
  blurb: 'iOS scheduling flow redesign, from intake to appointment confirmation.',
  tags: ['Product', 'Mobile']
}, {
  title: 'Fieldstone Docs',
  blurb: 'Documentation site and design tokens for a developer platform.',
  tags: ['Design system', 'Docs']
}];
function ProjectsSection() {
  const {
    Card,
    Tag,
    SectionHeading
  } = window.PortfolioDesignSystem_19f0ec;
  return /*#__PURE__*/React.createElement("section", {
    id: "work",
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: 'var(--space-7) var(--side-margin-mobile)'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "Selected work",
    title: "Recent case studies"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: 'var(--space-4)',
      marginTop: 'var(--space-5)'
    }
  }, PROJECTS.map((p, i) => /*#__PURE__*/React.createElement(Card, {
    key: i
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontWeight: 600,
      fontSize: 'var(--text-h4)',
      color: 'var(--text-heading)',
      margin: 0
    }
  }, p.title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: 'var(--text-base)',
      lineHeight: 'var(--leading-relaxed)',
      color: 'var(--text-body)',
      margin: '12px 0 0'
    }
  }, p.blurb), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap',
      marginTop: 'var(--space-3)'
    }
  }, p.tags.map((t, j) => /*#__PURE__*/React.createElement(Tag, {
    key: j,
    tone: t === 'Featured' ? 'accent' : 'neutral'
  }, t)))))));
}
window.ProjectsSection = ProjectsSection;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio-website/ProjectsSection.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Card = __ds_scope.Card;

__ds_ns.SectionHeading = __ds_scope.SectionHeading;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.NavLink = __ds_scope.NavLink;

})();
