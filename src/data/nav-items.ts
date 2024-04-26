import { type NavItem } from "@/types"

export const mainNavItems = [
  {
    title: "Naszyjniki",
    slug: "naszyjniki",
    href: "/kategorie/naszyjniki",
    description: "",
    subItems: [
      {
        title: "Złote",
        description: "",
        slug: "zlote",
        href: "/kategorie/naszyjniki/zlote",
      },
      {
        title: "Pozłacane",
        description: "",
        slug: "pozlacane",
        href: "/kategorie/naszyjniki/pozlacane",
      },
      {
        title: "Srebrne",
        description: "",
        slug: "srebrne",
        href: "/kategorie/naszyjniki/srebrne",
      },
      {
        title: "Pozostałe",
        description: "",
        slug: "pozostale",
        href: "/kategorie/naszyjniki/pozostale",
      },
      {
        title: "Wszystkie naszyjniki",
        description: "",
        slug: "wszystkie",
        href: "/kategorie/naszyjniki",
      },
    ],
  },
  {
    title: "Kolczyki",
    slug: "kolczyki",
    href: "/kategorie/kolczyki",
    description: "",
    subItems: [
      {
        title: "Złote",
        description: "",
        slug: "zlote",
        href: "/kategorie/kolczyki/zlote",
      },
      {
        title: "Pozłacane",
        description: "",
        slug: "pozlacane",
        href: "/kategorie/kolczyki/pozlacane",
      },
      {
        title: "Srebrne",
        description: "",
        slug: "srebrne",
        href: "/kategorie/kolczyki/srebrne",
      },
      {
        title: "Z diamentami",
        description: "",
        slug: "z-diamantami",
        href: "/kategorie/kolczyki/z-diamantami",
      },
      {
        title: "Z kamieniami",
        description: "",
        slug: "z-kamieniami",
        href: "/kategorie/kolczyki/z-kamieniami",
      },
      {
        title: "Pozostałe",
        description: "",
        slug: "pozostale",
        href: "/kategorie/kolczyki/pozostale",
      },
      {
        title: "Wszystkie kolczyki",
        description: "",
        slug: "wszystkie",
        href: "/kategorie/kolczyki",
      },
    ],
  },
  {
    title: "Pierścionki",
    slug: "pierscionki",
    href: "/kategorie/pierscionki",
    description: "",
    subItems: [
      {
        title: "Złote",
        description: "",
        slug: "zlote",
        href: "/kategorie/pierscionki/zlote",
      },
      {
        title: "Srebrne",
        description: "",
        slug: "srebrne",
        href: "/kategorie/pierscionki/srebrne",
      },
      {
        title: "Z cyrkonią",
        description: "",
        slug: "z-cyrkonia",
        href: "/kategorie/pierscionki/z-cyrkonia",
      },
      {
        title: "Pozostałe",
        description: "",
        slug: "pozostale",
        href: "/kategorie/pierscionki/pozostale",
      },
      {
        title: "Wszystkie pierścionki",
        description: "",
        slug: "wszystkie",
        href: "/kategorie/pierscionki",
      },
    ],
  },
  {
    title: "Inne",
    slug: "inne",
    href: "/kategorie/inne",
    description: "",
    subItems: [
      {
        title: "Nowości",
        description: "",
        slug: "nowosci",
        href: "/kategorie/inne/nowosci",
      },
      {
        title: "Polecane",
        description: "",
        slug: "polecane",
        href: "/kategorie/inne/polecane",
      },
      {
        title: "Wyprzedaże",
        description: "",
        slug: "wyprzedaze",
        href: "/kategorie/inne/wyprzedaze",
      },
      {
        title: "Prezenty",
        description: "",
        slug: "prezenty",
        href: "/kategorie/inne/prezenty",
      },
      {
        title: "Zestawy",
        description: "",
        slug: "zestawy",
        href: "/kategorie/inne/zestawy",
      },
      {
        title: "Akcesoria",
        description: "",
        slug: "akcesoria",
        href: "/kategorie/inne/akcesoria",
      },
      {
        title: "Wszystkie w kategorii",
        description: "",
        slug: "wszystkie",
        href: "/kategorie/inne",
      },
    ],
  },
] satisfies NavItem[]

export const sidebarNavItems = [] satisfies NavItem[]

export const footerNavItems = [
  {
    title: "O nas",
    href: "/",
    subItems: [
      {
        title: "Kim jesteśmy",
        href: "/kim-jestesmy",
        external: false,
      },
      {
        title: "Nasza misja",
        href: "/nasza-misja",
        external: false,
      },
      {
        title: "Kontakt",
        href: "/kontakt",
        external: false,
      },
    ],
  },
  {
    title: "Formalności",
    href: "/",
    subItems: [
      {
        title: "Regulamin sklepu",
        href: "/regulamin-sklepu",
        external: false,
      },
      {
        title: "Polityka prywatności",
        href: "/polityka-prywatnosci",
        external: false,
      },
      {
        title: "Najczęstsze  pytania",
        href: "/faq",
        external: false,
      },
    ],
  },
  {
    title: "Inne",
    href: "/",
    subItems: [
      {
        title: "Panel klienta",
        href: "/panel-klienta/ustawienia/dane-osobowe",
        external: false,
      },
      {
        title: "Dostawa i płatności",
        href: "/dostawa-platnosci",
        external: false,
      },
      {
        title: "Wymiana i zwroty",
        href: "/wymiana-zwroty",
        external: false,
      },
    ],
  },
] satisfies NavItem[]

export const adminNavItems = [
  {
    title: "Sklep",
    slug: "sklep",
    href: "/",
    icon: "home",
    external: false,
    disabled: false,
  },
  {
    title: "Zamówienia",
    slug: "produkty",
    href: "/admin/zamowienia",
    icon: "shoppingCart",
    external: false,
    disabled: false,
  },
  {
    title: "Produkty",
    slug: "produkty",
    href: "/admin/produkty",
    icon: "box",
    external: false,
    disabled: false,
  },
  {
    title: "Kategorie",
    slug: "kategorie",
    href: "/admin/kategorie",
    icon: "categories",
    external: false,
    disabled: false,
  },
  {
    title: "Podkategorie",
    slug: "podkategorie",
    href: "/admin/podkategorie",
    icon: "subcategories",
    external: false,
    disabled: false,
  },
  {
    title: "Tagi",
    slug: "tagi",
    href: "/admin/tagi",
    icon: "tag",
    external: false,
    disabled: false,
  },
  {
    title: "Klienci",
    slug: "klienci",
    href: "/admin/klienci",
    icon: "users",
    external: false,
    disabled: false,
  },
  {
    title: "Użytkownicy",
    slug: "uzytkownicy",
    href: "/admin/uzytkownicy",
    icon: "userCog",
    external: false,
    disabled: false,
  },
  {
    title: "Statystyki",
    slug: "statystyki",
    href: "/admin/statystyki",
    icon: "barChart",
    external: false,
    disabled: false,
  },
  {
    title: "Promocje",
    slug: "promocje",
    href: "/admin/promocje",
    icon: "percent",
    external: false,
    disabled: false,
  },
] satisfies NavItem[]

export const clientSettingsNavItems = [
  {
    title: "Dane osobowe",
    href: "/panel-klienta/ustawienia/dane-osobowe",
    slug: "dane-osobowe",
    external: false,
  },
  {
    title: "Adresy wysyłki",
    href: "/panel-klienta/ustawienia/adresy-wysylki",
    slug: "adresy-wysylki",
    external: false,
  },
  {
    title: "Metody płatności",
    href: "/panel-klienta/ustawienia/metody-platnosci",
    slug: "metody-platnosci",
    external: false,
  },
  {
    title: "Zmiana hasła",
    href: "/panel-klienta/ustawienia/zmiana-hasla",
    slug: "zmiana-hasla",
    external: false,
  },
  {
    title: "Usuwanie konta",
    href: "/panel-klienta/ustawienia/usuwanie-konta",
    slug: "usuwanie-konta",
    external: false,
  },
] satisfies NavItem[]
