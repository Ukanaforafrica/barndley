import { useState, useRef, useEffect, useMemo } from "react";
import { Search, X } from "lucide-react";

type EmojiEntry = { e: string; k: string[] };

const EMOJI_GROUPS: { group: string; items: EmojiEntry[] }[] = [
  {
    group: "Grains, Cereals & Pantry",
    items: [
      { e: "🍚", k: ["rice", "grain", "ofada", "white", "cooked"] },
      { e: "🌾", k: ["wheat", "grain", "cereal", "millet", "sorghum", "guinea corn", "barley"] },
      { e: "🌽", k: ["corn", "maize", "garri", "yellow"] },
      { e: "🫘", k: ["beans", "honey", "oloyin", "brown", "black eyed", "legume"] },
      { e: "🥣", k: ["oats", "oatmeal", "pap", "ogi", "custard", "porridge", "bowl"] },
      { e: "🍝", k: ["spaghetti", "pasta", "macaroni", "noodles"] },
      { e: "🍜", k: ["noodles", "indomie", "ramen", "cup noodles"] },
      { e: "🧂", k: ["salt", "seasoning"] },
    ],
  },
  {
    group: "Tubers & Roots",
    items: [
      { e: "🍠", k: ["yam", "sweet potato", "tuber"] },
      { e: "🥔", k: ["potato", "irish", "tuber", "cassava", "cocoyam"] },
      { e: "🍌", k: ["banana", "plantain", "ripe"] },
      { e: "🌱", k: ["sprout", "fresh", "young"] },
    ],
  },
  {
    group: "Vegetables & Leafy",
    items: [
      { e: "🥬", k: ["ugu", "spinach", "leaf", "vegetable", "bitter leaf", "scent leaf", "waterleaf", "cabbage", "lettuce", "greens"] },
      { e: "🥒", k: ["cucumber", "okra", "green"] },
      { e: "🥦", k: ["broccoli", "green"] },
      { e: "🥕", k: ["carrot", "root"] },
      { e: "🫑", k: ["bell pepper", "tatashe", "capsicum"] },
      { e: "🌶️", k: ["pepper", "chilli", "rodo", "scotch bonnet", "spicy", "hot", "dry pepper"] },
      { e: "🍅", k: ["tomato", "tatashe", "paste"] },
      { e: "🧅", k: ["onion"] },
      { e: "🧄", k: ["garlic"] },
      { e: "🫚", k: ["ginger", "root"] },
      { e: "🍆", k: ["eggplant", "garden egg", "aubergine"] },
    ],
  },
  {
    group: "Fruits",
    items: [
      { e: "🍎", k: ["apple", "fruit", "red"] },
      { e: "🍏", k: ["apple", "green"] },
      { e: "🍊", k: ["orange", "citrus", "tangerine"] },
      { e: "🍋", k: ["lemon", "lime", "citrus"] },
      { e: "🍐", k: ["pear"] },
      { e: "🍍", k: ["pineapple"] },
      { e: "🍉", k: ["watermelon"] },
      { e: "🍇", k: ["grape"] },
      { e: "🍓", k: ["strawberry", "berry"] },
      { e: "🫐", k: ["blueberry", "berry"] },
      { e: "🥭", k: ["mango"] },
      { e: "🥥", k: ["coconut"] },
      { e: "🥑", k: ["avocado"] },
      { e: "🍑", k: ["peach"] },
      { e: "🍒", k: ["cherry", "berry"] },
      { e: "🍈", k: ["melon"] },
    ],
  },
  {
    group: "Meat, Fish & Protein",
    items: [
      { e: "🍗", k: ["chicken", "drumstick", "turkey", "poultry"] },
      { e: "🍖", k: ["meat", "beef", "goat meat", "ponmo"] },
      { e: "🥩", k: ["beef", "steak", "meat", "raw"] },
      { e: "🥓", k: ["bacon", "pork", "sausage"] },
      { e: "🌭", k: ["sausage", "hotdog"] },
      { e: "🐟", k: ["fish", "tilapia", "fresh fish"] },
      { e: "🐠", k: ["fish", "tropical"] },
      { e: "🐡", k: ["fish", "puffer"] },
      { e: "🦐", k: ["prawn", "shrimp"] },
      { e: "🦞", k: ["lobster"] },
      { e: "🦀", k: ["crab"] },
      { e: "🦑", k: ["squid", "calamari"] },
      { e: "🐙", k: ["octopus"] },
      { e: "🐌", k: ["snail"] },
      { e: "🥚", k: ["egg", "eggs"] },
      { e: "🍤", k: ["shrimp", "fried"] },
    ],
  },
  {
    group: "Oils, Spices & Condiments",
    items: [
      { e: "🫙", k: ["jar", "paste", "groundnut paste", "peanut butter", "jam"] },
      { e: "🍯", k: ["honey", "syrup"] },
      { e: "🧈", k: ["butter", "margarine"] },
      { e: "🫗", k: ["oil", "palm oil", "vegetable oil", "groundnut oil", "coconut oil", "pour"] },
      { e: "🌰", k: ["nut", "groundnut", "chestnut", "palm kernel"] },
      { e: "🥜", k: ["peanut", "groundnut", "nut"] },
      { e: "🧊", k: ["ice", "frozen"] },
    ],
  },
  {
    group: "Bread, Dairy & Breakfast",
    items: [
      { e: "🍞", k: ["bread", "loaf"] },
      { e: "🥖", k: ["baguette", "bread"] },
      { e: "🥐", k: ["croissant", "pastry"] },
      { e: "🥯", k: ["bagel"] },
      { e: "🧇", k: ["waffle"] },
      { e: "🥞", k: ["pancake"] },
      { e: "🥛", k: ["milk", "dairy", "sachet milk"] },
      { e: "🧀", k: ["cheese"] },
      { e: "🍦", k: ["yogurt", "ice cream", "dairy"] },
      { e: "🥣", k: ["cornflakes", "cereal", "golden morn", "bowl"] },
    ],
  },
  {
    group: "Snacks & Sweets",
    items: [
      { e: "🍪", k: ["biscuit", "cookie", "chin chin"] },
      { e: "🍩", k: ["donut", "snack"] },
      { e: "🍿", k: ["popcorn"] },
      { e: "🍫", k: ["chocolate"] },
      { e: "🍬", k: ["candy", "sweet"] },
      { e: "🍭", k: ["lollipop", "candy"] },
      { e: "🎂", k: ["cake"] },
      { e: "🧁", k: ["cupcake", "muffin"] },
      { e: "🥨", k: ["pretzel", "snack"] },
      { e: "🍘", k: ["chips", "plantain chips", "cracker"] },
    ],
  },
  {
    group: "Drinks & Beverages",
    items: [
      { e: "💧", k: ["water", "drink"] },
      { e: "🥤", k: ["soft drink", "soda", "cup", "juice", "milo", "energy"] },
      { e: "🧃", k: ["juice box", "juice", "drink"] },
      { e: "🧋", k: ["bubble tea", "drink"] },
      { e: "🍵", k: ["tea"] },
      { e: "☕", k: ["coffee", "tea", "hot"] },
      { e: "🍶", k: ["bottle", "sake"] },
      { e: "🍺", k: ["beer", "malt"] },
      { e: "🍷", k: ["wine"] },
      { e: "🥂", k: ["champagne", "celebrate"] },
    ],
  },
  {
    group: "Prepared & Packaged",
    items: [
      { e: "🥫", k: ["can", "canned", "sardine", "tomato paste", "baked beans", "corned beef"] },
      { e: "🍱", k: ["bento", "meal", "packed"] },
      { e: "🍲", k: ["soup", "stew", "pot", "egusi", "ogbono"] },
      { e: "🍛", k: ["curry", "rice and stew", "jollof"] },
      { e: "🥘", k: ["paella", "stew", "pot"] },
      { e: "🍳", k: ["fried egg", "cooking"] },
      { e: "🥟", k: ["dumpling", "meat pie"] },
      { e: "🌮", k: ["taco"] },
      { e: "🌯", k: ["burrito", "shawarma", "wrap"] },
      { e: "🥙", k: ["pita", "wrap"] },
      { e: "🍔", k: ["burger"] },
      { e: "🍟", k: ["fries", "chips"] },
      { e: "🍕", k: ["pizza"] },
      { e: "🍣", k: ["sushi"] },
      { e: "🍙", k: ["rice ball"] },
    ],
  },
  {
    group: "Household & Misc",
    items: [
      { e: "🛒", k: ["cart", "shopping", "mart", "provision"] },
      { e: "🛍️", k: ["bag", "nylon", "shopping"] },
      { e: "🥡", k: ["takeout", "box", "container", "storage"] },
      { e: "🍽️", k: ["plate", "disposable", "dish"] },
      { e: "🥄", k: ["spoon"] },
      { e: "🧻", k: ["paper towel", "tissue"] },
      { e: "🔥", k: ["fire", "gas lighter", "hot"] },
      { e: "📦", k: ["box", "package", "carton"] },
    ],
  },
];

const ALL_ITEMS = EMOJI_GROUPS.flatMap((g) => g.items);

export function EmojiPicker({
  value,
  onChange,
  hint = "",
}: {
  value: string;
  onChange: (e: string) => void;
  hint?: string;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // Auto-suggest based on hint (item name + category + description)
  const suggestions = useMemo(() => {
    const h = hint.toLowerCase();
    if (!h.trim()) return [];
    const scored = ALL_ITEMS.map((it) => {
      const score = it.k.reduce((s, kw) => (h.includes(kw) ? s + kw.length : s), 0);
      return { it, score };
    }).filter((x) => x.score > 0);
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 8).map((x) => x.it);
  }, [hint]);

  const filtered = useMemo(() => {
    if (!q.trim()) return null;
    const s = q.toLowerCase();
    return ALL_ITEMS.filter((it) => it.k.some((kw) => kw.includes(s)));
  }, [q]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-14 h-12 text-2xl text-center rounded-xl bg-card border border-border hover:bg-secondary transition-colors"
        aria-label="Pick emoji"
      >
        {value || "🥫"}
      </button>

      {open && (
        <div className="absolute z-[60] left-0 mt-1.5 w-[320px] max-w-[88vw] rounded-2xl bg-background border border-border shadow-xl overflow-hidden animate-in fade-in-0 zoom-in-95">
          <div className="flex items-center justify-between px-3 h-11 border-b border-border">
            <div className="flex items-center gap-2 flex-1">
              <Search className="size-4 text-foreground/40" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search emoji…"
                className="flex-1 bg-transparent text-sm focus:outline-none"
              />
            </div>
            <button onClick={() => setOpen(false)} className="ml-2 h-7 w-7 rounded-full hover:bg-secondary flex items-center justify-center">
              <X className="size-3.5" />
            </button>
          </div>

          <div className="max-h-72 overflow-y-auto p-2">
            {filtered ? (
              <Grid items={filtered} value={value} onPick={(e) => { onChange(e); setOpen(false); }} />
            ) : (
              <>
                {suggestions.length > 0 && (
                  <Section title="Suggested for this item">
                    <Grid items={suggestions} value={value} onPick={(e) => { onChange(e); setOpen(false); }} />
                  </Section>
                )}
                {EMOJI_GROUPS.map((g) => (
                  <Section key={g.group} title={g.group}>
                    <Grid items={g.items} value={value} onPick={(e) => { onChange(e); setOpen(false); }} />
                  </Section>
                ))}
              </>
            )}
            {filtered && filtered.length === 0 && (
              <div className="px-3 py-6 text-center text-xs text-foreground/50">No emoji matches</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <div className="text-[0.65rem] font-semibold tracking-wide uppercase text-foreground/50 px-1 mb-1">{title}</div>
      {children}
    </div>
  );
}

function Grid({ items, value, onPick }: { items: EmojiEntry[]; value: string; onPick: (e: string) => void }) {
  return (
    <div className="grid grid-cols-7 gap-1">
      {items.map((it) => (
        <button
          key={it.e}
          type="button"
          onClick={() => onPick(it.e)}
          className={`h-9 w-9 rounded-lg text-xl flex items-center justify-center hover:bg-secondary transition-colors ${
            value === it.e ? "bg-primary-soft ring-1 ring-primary" : ""
          }`}
          title={it.k[0]}
        >
          {it.e}
        </button>
      ))}
    </div>
  );
}
