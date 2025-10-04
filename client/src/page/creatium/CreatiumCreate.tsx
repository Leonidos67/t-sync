import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TipTapEditor from "@/components/tiptap-editor";
import { useToast } from "@/hooks/use-toast";
import useAuth from "@/hooks/api/use-auth";
import { ChevronUp, X, Globe, Mountain, Compass, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import BottomSheet from "@/components/ui/bottom-sheet";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";

const CreatiumCreate: React.FC = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { data: currentUser } = useAuth();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [headline, setHeadline] = useState("");
  const [description, setDescription] = useState("");
  const [about, setAbout] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [completedSteps] = useState(0);
  const [selectedCoverIndex, setSelectedCoverIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<'gradient' | 'geometric' | 'effects'>('gradient');
  const [priceType, setPriceType] = useState<'free' | 'one_time' | 'recurring'>('free');
  const [price, setPrice] = useState<string>("");
  const [recurrence, setRecurrence] = useState<'7d' | '1m' | '3m' | '6m' | '1y' | 'custom' | ''>('');
  const [customDays, setCustomDays] = useState<string>("");
  const [socialLinks, setSocialLinks] = useState<Array<{ id: string; type: string; url: string }>>([]);
  const [isAddLinkOpen, setIsAddLinkOpen] = useState(false);
  const [newLinkType, setNewLinkType] = useState<string>("instagram");
  const [newLinkUrl, setNewLinkUrl] = useState<string>("");
  const [trainerPricingEnabled, setTrainerPricingEnabled] = useState<boolean>(false);
  const prefixRef = useRef<HTMLSpanElement | null>(null);
  const [prefixPadding, setPrefixPadding] = useState<number>(0);

  useEffect(() => {
    const updatePadding = () => {
      const width = prefixRef.current?.offsetWidth || 0;
      setPrefixPadding(width + 12);
    };
    updatePadding();
    window.addEventListener('resize', updatePadding);
    return () => window.removeEventListener('resize', updatePadding);
  }, [newLinkType]);

  const renderNetworkIcon = (type: string) => {
    const common = "h-4 w-4";
    // External white icons per request
    const ICONS = {
      telegram: "https://img.icons8.com/?size=100&id=iSmEebXt56Ux&format=png&color=ffffff",
      instagram: "https://img.icons8.com/?size=100&id=ZOFC5nSr215Y&format=png&color=ffffff",
      whatsapp: "https://img.icons8.com/?size=100&id=awgnv1k3kfTS&format=png&color=ffffff",
      youtube: "https://img.icons8.com/?size=100&id=NgVx6SS0Wbjb&format=png&color=ffffff",
      rutube: "https://img.icons8.com/?size=100&id=NgVx6SS0Wbjb&format=png&color=ffffff",
      vk: "https://img.icons8.com/?size=100&id=T2ayUZTaZOJL&format=png&color=ffffff",
    } as const;

    switch (type) {
      case "telegram_user":
      case "telegram_channel":
        return <img src={ICONS.telegram} alt="Telegram" className={common} />;
      case "instagram":
        return <img src={ICONS.instagram} alt="Instagram" className={common} />;
      case "whatsapp":
        return <img src={ICONS.whatsapp} alt="WhatsApp" className={common} />;
      case "youtube":
        return <img src={ICONS.youtube} alt="YouTube" className={common} />;
      case "rutube":
        return <img src={ICONS.rutube} alt="Rutube" className={common} />;
      case "vk":
        return <img src={ICONS.vk} alt="VK" className={common} />;
      case "strava":
        return <Mountain className="h-4 w-4 text-white" />;
      case "garmin":
        return <Compass className="h-4 w-4 text-white" />;
      default:
        return <Globe className="h-4 w-4 text-white" />;
    }
  };

  // Cover variants: Tailwind gradients and custom styled backgrounds
  const coverVariants: Array<{ className?: string; style?: React.CSSProperties; category: 'gradient' | 'geometric' | 'effects' }> = [
    { className: "bg-gradient-to-r from-purple-500 to-pink-500", category: 'gradient' },
    { className: "bg-gradient-to-r from-blue-500 to-cyan-400", category: 'gradient' },
    { className: "bg-gradient-to-r from-emerald-500 to-lime-400", category: 'gradient' },
    { className: "bg-gradient-to-r from-orange-500 to-amber-400", category: 'gradient' },
    { className: "bg-gradient-to-r from-rose-500 to-red-400", category: 'gradient' },
    { className: "bg-gradient-to-r from-slate-600 to-slate-400", category: 'gradient' },
    { className: "bg-gradient-to-r from-indigo-500 to-violet-500", category: 'gradient' },
    { className: "bg-gradient-to-r from-teal-500 to-green-400", category: 'gradient' },
    // Extra options provided
    {
      style: {
        background: "#0f172a",
        backgroundImage: `radial-gradient(circle, rgba(139,92,246,0.6) 1px, transparent 1px),
        radial-gradient(circle, rgba(59,130,246,0.4) 1px, transparent 1px),
        radial-gradient(circle, rgba(236,72,153,0.5) 1px, transparent 1px)`,
        backgroundSize: "20px 20px, 40px 40px, 60px 60px",
        backgroundPosition: "0 0, 10px 10px, 30px 30px",
      },
      category: 'geometric',
    },
    {
      style: {
        background: "#0f172a",
        backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px),
        radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)`,
        backgroundSize: "20px 20px, 20px 20px, 20px 20px",
        backgroundPosition: "0 0, 0 0, 0 0",
      },
      category: 'geometric',
    },
    {
      style: {
        background: "#000000",
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.2) 1px, transparent 0),
        radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.18) 1px, transparent 0),
        radial-gradient(circle at 1px 1px, rgba(236, 72, 153, 0.15) 1px, transparent 0)`,
        backgroundSize: "20px 20px, 30px 30px, 25px 25px",
        backgroundPosition: "0 0, 10px 10px, 15px 5px",
      },
      category: 'geometric',
    },
    // 4. Gradient Diagonal Lines Pattern (green hues)
    {
      style: {
        background: "#000000",
        backgroundImage: `repeating-linear-gradient(45deg, rgba(0, 255, 65, 0.08) 0, rgba(0, 255, 65, 0.08) 1px, transparent 1px, transparent 12px),
        repeating-linear-gradient(-45deg, rgba(0, 255, 65, 0.08) 0, rgba(0, 255, 65, 0.08) 1px, transparent 1px, transparent 12px),
        repeating-linear-gradient(90deg, rgba(0, 255, 65, 0.03) 0, rgba(0, 255, 65, 0.03) 1px, transparent 1px, transparent 4px)`,
        backgroundSize: "24px 24px, 24px 24px, 8px 8px",
      },
      category: 'geometric',
    },
    // 6. Diagonal Grid Orange/Red Glow
    {
      style: {
        background: "#0f0f0f",
        backgroundImage: `repeating-linear-gradient(45deg, rgba(255, 140, 0, 0.12) 0, rgba(255, 140, 0, 0.12) 1px, transparent 1px, transparent 22px),
        repeating-linear-gradient(-45deg, rgba(255, 69, 0, 0.08) 0, rgba(255, 69, 0, 0.08) 1px, transparent 1px, transparent 22px)`,
        backgroundSize: "44px 44px",
      },
      category: 'geometric',
    },
    // 7. Complex Multiplier Pattern (Enhanced)
    {
      style: {
        background: "#101014",
        backgroundImage: `repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 40px),
        repeating-linear-gradient(45deg, rgba(0,255,128,0.09) 0, rgba(0,255,128,0.09) 1px, transparent 1px, transparent 20px),
        repeating-linear-gradient(-45deg, rgba(255,0,128,0.10) 0, rgba(255,0,128,0.10) 1px, transparent 1px, transparent 30px),
        repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 80px),
        radial-gradient(circle at 60% 40%, rgba(0,255,128,0.05) 0, transparent 60%)`,
        backgroundSize: "80px 80px, 40px 40px, 60px 60px, 80px 80px, 100% 100%",
        backgroundPosition: "0 0, 0 0, 0 0, 40px 40px, center",
      },
      category: 'geometric',
    },
    // 8. Gradient Diagonal Lines Pattern (magenta stripes)
    {
      style: {
        background: "#0f0f0f",
        backgroundImage: `repeating-linear-gradient(-45deg, rgba(255, 0, 100, 0.2) 0px, rgba(255, 0, 100, 0) 2px, transparent 2px, transparent 25px)`,
      },
      category: 'geometric',
    },
    // Effects category
    // 1. Cosmic Aurora
    {
      style: {
        background: "#0a0a0a",
        backgroundImage: `radial-gradient(ellipse at 20% 30%, rgba(56, 189, 248, 0.4) 0%, transparent 60%),
        radial-gradient(ellipse at 80% 70%, rgba(139, 92, 246, 0.3) 0%, transparent 70%),
        radial-gradient(ellipse at 60% 20%, rgba(236, 72, 153, 0.25) 0%, transparent 50%),
        radial-gradient(ellipse at 40% 80%, rgba(34, 197, 94, 0.2) 0%, transparent 65%)`,
      },
      category: 'effects',
    },
    // 3. Northern Aurora
    {
      style: {
        background: `radial-gradient(ellipse 70% 55% at 50% 50%, rgba(255, 20, 147, 0.15), transparent 50%),
          radial-gradient(ellipse 160% 130% at 10% 10%, rgba(0, 255, 255, 0.12), transparent 60%),
          radial-gradient(ellipse 160% 130% at 90% 90%, rgba(138, 43, 226, 0.18), transparent 65%),
          radial-gradient(ellipse 110% 50% at 80% 30%, rgba(255, 215, 0, 0.08), transparent 40%),
          #000000`,
      },
      category: 'effects',
    },
    // 4. Crimson Core Glow
    {
      style: {
        background: "linear-gradient(0deg, rgba(0,0,0,0.6), rgba(0,0,0,0.6)), radial-gradient(68% 58% at 50% 50%, #c81e3a 0%, #a51d35 16%, #7d1a2f 32%, #591828 46%, #3c1722 60%, #2a151d 72%, #1f1317 84%, #141013 94%, #0a0a0a 100%), radial-gradient(90% 75% at 50% 50%, rgba(228,42,66,0.06) 0%, rgba(228,42,66,0) 55%), radial-gradient(150% 120% at 8% 8%, rgba(0,0,0,0) 42%, #0b0a0a 82%, #070707 100%), radial-gradient(150% 120% at 92% 92%, rgba(0,0,0,0) 42%, #0b0a0a 82%, #070707 100%), radial-gradient(60% 50% at 50% 60%, rgba(240,60,80,0.06), rgba(0,0,0,0) 60%), #050505",
      },
      category: 'effects',
    },
    // 5. Deep Ocean Glow
    {
      style: {
        background: "radial-gradient(70% 55% at 50% 50%, #2a5d77 0%, #184058 18%, #0f2a43 34%, #0a1b30 50%, #071226 66%, #040d1c 80%, #020814 92%, #01040d 97%, #000309 100%), radial-gradient(160% 130% at 10% 10%, rgba(0,0,0,0) 38%, #000309 76%, #000208 100%), radial-gradient(160% 130% at 90% 90%, rgba(0,0,0,0) 38%, #000309 76%, #000208 100%)",
      },
      category: 'effects',
    },
    // 6. Midnight Ember
    {
      style: {
        background: "radial-gradient(ellipse at center, #3d2914 0%, #2a1810 30%, #1a0f0a 60%, #0d0806 100%)",
      },
      category: 'effects',
    },
    // 7. Volcanic Ember
    {
      style: {
        background: `radial-gradient(ellipse 120% 70% at 70% 80%, rgba(87, 24, 69, 0.20), transparent 52%),
        radial-gradient(ellipse 160% 45% at 30% 30%, rgba(153, 27, 27, 0.16), transparent 58%),
        radial-gradient(ellipse 85% 100% at 10% 60%, rgba(69, 26, 3, 0.22), transparent 46%),
        #1c1917`,
      },
      category: 'effects',
    },
    // 8. Cosmic Noise
    {
      style: {
        background: "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08) 0%, transparent 40%), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.05) 0%, transparent 40%), linear-gradient(120deg, #0f0e17 0%, #1a1b26 100%)",
      },
      category: 'effects',
    },
  ];

  useEffect(() => {
    if (!currentUser?.user) return;
    try {
      const websites = JSON.parse(localStorage.getItem("websites") || "{}");
      const existing = websites[currentUser.user.username || ""];
      if (existing) {
        setTitle(existing.title || "");
        setHeadline(existing.headline || "");
        setDescription(existing.description || "");
        setAbout(existing.about || "");
        if (typeof existing.selectedCoverIndex === "number") {
          setSelectedCoverIndex(existing.selectedCoverIndex);
        }
        if (typeof existing.selectedCategory === "string") {
          setSelectedCategory(existing.selectedCategory as typeof selectedCategory);
        }
        if (typeof existing.priceType === "string") {
          setPriceType(existing.priceType as typeof priceType);
        }
        if (typeof existing.price === "string" || typeof existing.price === "number") {
          setPrice(String(existing.price));
        }
        if (typeof existing.recurrence === "string") {
          setRecurrence(existing.recurrence as typeof recurrence);
        }
        if (typeof existing.customDays === "string" || typeof existing.customDays === "number") {
          setCustomDays(String(existing.customDays));
        }
        if (Array.isArray(existing.socialLinks)) {
          setSocialLinks(existing.socialLinks);
        }
        if (typeof existing.trainerPricingEnabled === "boolean") {
          setTrainerPricingEnabled(existing.trainerPricingEnabled);
        }
      }
    } catch {
      // Ignore parsing errors
    }
  }, [currentUser?.user]);

  // Auto-save changes to localStorage with debounce
  useEffect(() => {
    if (!currentUser?.user) return;
    const usernameKey = currentUser.user.username || "";
    const timer = setTimeout(() => {
      try {
        const websites = JSON.parse(localStorage.getItem("websites") || "{}");
        const existing = websites[usernameKey] || {};
        const createdAt = existing.createdAt || new Date().toISOString();
        const payload = {
          ...existing,
          _id: existing._id || Date.now().toString(),
          userId: currentUser.user._id,
          username: usernameKey,
          email: currentUser.user.email,
          title,
          headline,
          description,
          about,
          selectedCoverIndex,
          selectedCategory,
          priceType,
          price,
          recurrence,
          customDays,
          socialLinks,
          trainerPricingEnabled,
          createdAt,
          updatedAt: new Date().toISOString(),
        };
        websites[usernameKey] = payload;
        localStorage.setItem("websites", JSON.stringify(websites));
      } catch {
        // Silent fail for autosave
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [title, headline, description, about, selectedCoverIndex, selectedCategory, priceType, price, recurrence, customDays, socialLinks, trainerPricingEnabled, currentUser?.user]);

  const save = async () => {
    if (!currentUser?.user) {
      toast({ title: "Ошибка", description: "Пользователь не найден", variant: "destructive" });
      return;
    }
    if (!title.trim() || !headline.trim() || !description.trim() || !about.trim()) {
      toast({ title: "Уведомление", description: "Заполните поля: название, заголовок, описание и о себе обязательны" });
      return;
    }
    setIsSaving(true);
    try {
      const websites = JSON.parse(localStorage.getItem("websites") || "{}");
      const payload = {
        _id: Date.now().toString(),
        userId: currentUser.user._id,
        username: currentUser.user.username || "",
        email: currentUser.user.email,
        title,
        headline,
        description,
        about,
        selectedCoverIndex,
        priceType,
        price,
        recurrence,
        customDays,
        socialLinks,
        trainerPricingEnabled,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      websites[currentUser.user.username || ""] = payload;
      localStorage.setItem("websites", JSON.stringify(websites));
      toast({ title: "Сохранено", description: "Ваш персональный сайт обновлен" });
    } catch {
      toast({ title: "Ошибка", description: "Не удалось сохранить", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const networks: Array<{ value: string; label: string; placeholder?: string }> = [
    { value: "telegram_user", label: "Telegram User", placeholder: "https://t.me/username" },
    { value: "telegram_channel", label: "Telegram Channel", placeholder: "https://t.me/channel" },
    { value: "whatsapp", label: "WhatsApp", placeholder: "https://wa.me/phone" },
    { value: "vk", label: "Vk", placeholder: "https://vk.com/username" },
    { value: "instagram", label: "Instagram", placeholder: "https://instagram.com/username" },
    { value: "youtube", label: "YouTube", placeholder: "https://youtube.com/@channel" },
    { value: "rutube", label: "Rutube", placeholder: "https://rutube.ru/channel/ID" },
    { value: "strava", label: "Strava", placeholder: "https://www.strava.com/athletes/ID" },
    { value: "garmin", label: "Garmin", placeholder: "https://connect.garmin.com/modern/profile/username" },
  ];

  const getNetworkBase = (type: string): string => {
    switch (type) {
      case "telegram_user":
      case "telegram_channel":
        return "https://t.me/";
      case "vk":
        return "https://vk.com/";
      case "instagram":
        return "https://instagram.com/";
      case "youtube":
        return "https://youtube.com/";
      case "rutube":
        return "https://rutube.ru/";
      case "whatsapp":
        return "https://wa.me/";
      case "strava":
        return "https://www.strava.com/";
      case "garmin":
        return "https://connect.garmin.com/modern/profile/";
      default:
        return "https://";
    }
  };

  const getNetworkSuffixPlaceholder = (type: string): string => {
    switch (type) {
      case "telegram_user":
        return "username";
      case "telegram_channel":
        return "channel";
      case "vk":
        return "username";
      case "instagram":
        return "username";
      case "youtube":
        return "@channel";
      case "rutube":
        return "channel";
      case "whatsapp":
        return "phone";
      case "strava":
        return "athletes/ID";
      case "garmin":
        return "username";
      default:
        return "username";
    }
  };

  const addSocialLink = () => {
    if (!newLinkUrl.trim()) {
      toast({ title: "Уведомление", description: "Введите ссылку" });
      return;
    }
    const raw = newLinkUrl.trim();
    const base = getNetworkBase(newLinkType);
    const finalUrl = /^(https?:)?\/\//i.test(raw) ? raw : `${base}${raw.replace(/^\/+/, "")}`;
    setSocialLinks((prev) => [
      ...prev,
      { id: Date.now().toString(), type: newLinkType, url: finalUrl },
    ]);
    setNewLinkUrl("");
    setNewLinkType("instagram");
    setIsAddLinkOpen(false);
  };

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="mx-auto px-0 py-0">
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-64 shrink-0 bg-card/50 p-3 flex flex-col">
            <div className="text-base font-semibold mb-3">T‑Sync Creatium</div>
            <nav className="flex flex-col gap-1">
              <Link to="/creatium" className="px-2 py-1 rounded hover:bg-accent hover:text-accent-foreground transition-colors">Главная</Link>
              <Link to="/creatium/create" className="px-2 py-1 rounded bg-accent text-accent-foreground">Мои сайты</Link>
              <Link to="#" className="px-2 py-1 rounded hover:bg-accent hover:text-accent-foreground transition-colors">Просмотр</Link>
            </nav>
            {/* Guide section at bottom */}
            <div className="mt-auto bg-[#111] rounded-2xl p-2 mb-[5px]">
              <Button
                variant="ghost"
                className="w-full justify-between text-left rounded-2xl"
                onClick={() => setIsGuideOpen(!isGuideOpen)}
              >
                <span>Руководство</span>
                <ChevronUp className={`h-4 w-4 transition-transform ${isGuideOpen ? 'rotate-180' : ''}`} />
              </Button>
              {/* Expandable items with animation */}
              <div
                className={`transition-all duration-300 overflow-hidden ${isGuideOpen ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}
              >
                <div className="space-y-1 animate-in slide-in-from-top-2 duration-200">
                  <div className="px-2 py-1 text-sm text-muted-foreground">Пункт 1</div>
                  <div className="px-2 py-1 text-sm text-muted-foreground">Пункт 2</div>
                  <div className="px-2 py-1 text-sm text-muted-foreground">Пункт 3</div>
                </div>
              </div>
              {/* Progress bar always visible under items */}
              <div className="mt-2 flex items-center gap-2 p-2 rounded">
                <span className="text-xs text-muted-foreground w-8">{completedSteps}/3</span>
                <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${(completedSteps / 3) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Content area */}
          <main className="flex-1 pr-[15px] pt-[15px] pb-[15px] bg-[#000] overflow-hidden">
            {/* Parent block with border and 15px padding, full viewport height */}
            <div className="border rounded-2xl bg-[#111] shadow-sm p-[15px] h-[calc(100vh-30px)] overflow-hidden">
              {/* <div className="flex items-center justify-between mb-4">
                <div className="text-lg font-semibold">Редактор персонального сайта</div>
              </div> */}

              <div className="grid gap-4 h-full min-h-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full min-h-0">
                  {/* Left: Form fields */}
                  <div className="flex flex-col gap-4 h-full min-h-0 overflow-y-auto left-scroll pr-1 pb-8">
                    {/* Cover selector */}
                    <div>
                      <Label>Обложка</Label>
                      {/* Category tabs */}
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        {([
                          { key: 'gradient', label: 'Градиентный' },
                          { key: 'geometric', label: 'Геометрический' },
                          { key: 'effects', label: 'Эффекты' },
                        ] as const).map((tab) => (
                          <button
                            key={tab.key}
                            type="button"
                            onClick={() => setSelectedCategory(tab.key)}
                            className={`h-9 rounded-md border text-sm transition-colors ${
                              selectedCategory === tab.key
                                ? 'bg-white/10 border-white/20'
                                : 'bg-transparent border-white/10 hover:bg-white/5'
                            }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>

                      <div className="mt-3 overflow-x-auto rounded-lg cover-scroll" style={{ scrollbarWidth: "thin", scrollbarColor: "#444 #0a0a0a" }}>
                        <div className="flex gap-2 px-2 py-2 w-max">
                          {coverVariants
                            .map((variant, idx) => ({ ...variant, idx }))
                            .filter((v) => v.category === selectedCategory)
                            .map((variant) => (
                              <button
                                key={variant.idx}
                                type="button"
                                onClick={() => setSelectedCoverIndex(variant.idx)}
                                className={`h-14 w-24 rounded-lg ${variant.className ?? ""} shrink-0 focus:outline-none border border-[#000] ${
                                  selectedCoverIndex === variant.idx ? "ring-2 ring-white/50" : ""
                                }`}
                                style={variant.style}
                                aria-pressed={selectedCoverIndex === variant.idx}
                                aria-label={`Выбрать обложку ${variant.idx + 1}`}
                              />
                            ))}
                        </div>
                      </div>
                      {/* Dark scrollbar styles for WebKit browsers */}
                      <style>{`
                        .cover-scroll::-webkit-scrollbar { height: 8px; }
                        .cover-scroll::-webkit-scrollbar-track { background: #0a0a0a; border-radius: 9999px; }
                        .cover-scroll::-webkit-scrollbar-thumb { background: #444; border-radius: 9999px; }
                        .cover-scroll::-webkit-scrollbar-thumb:hover { background: #555; }
                      `}</style>
                      <div className="mt-2" />
                    </div>
                    {/* Username (read-only) */}
                    <div>
                      <Label>Имя пользователя</Label>
                      <Input
                        className="mt-1"
                        value={currentUser?.user?.username || ""}
                        disabled
                        placeholder="username"
                      />
                    </div>
                    <div>
                      <Label>Название</Label>
                      <Input id="field-title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1" placeholder="" />
                    </div>
                    <div>
                      <Label>Заголовок</Label>
                      <Input value={headline} onChange={(e) => setHeadline(e.target.value)} className="mt-1" placeholder="" />
                    </div>
                    <div>
                      <Label>Краткое описание</Label>
                      <Input value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1" placeholder="" />
                    </div>
                    <div>
                      <Label>Ссылки на соц.сети</Label>
                      <button type="button" className="mt-2 w-full flex items-center justify-between rounded border border-input bg-[#000000] px-3 py-2 hover:bg-white/5" onClick={() => setIsAddLinkOpen(true)}>
                        <span className="flex items-center gap-2 text-sm">
                          <Plus className="h-4 w-4" />
                          Добавить ссылку
                        </span>
                      </button>
                      {isAddLinkOpen && (
                        isMobile ? (
                          <BottomSheet open={isAddLinkOpen} onOpenChange={setIsAddLinkOpen} className="pb-6 ai-bottom-sheet">
                            <div className="max-h-[70vh] overflow-y-auto px-5">
                              <div className="grid grid-cols-1 gap-3 items-start">
                                <div className="max-h-64 overflow-y-auto pr-1">
                                  <div className="grid gap-2">
                                    {networks.map((n) => (
                                      <button
                                        key={n.value}
                                        type="button"
                                        onClick={() => setNewLinkType(n.value)}
                                        className={`w-full text-left px-3 py-2 rounded border transition-colors flex items-center gap-2 ${newLinkType === n.value ? 'bg-white/10 border-white/20' : 'border-white/10 hover:bg-white/5'}`}
                                      >
                                        <span className="inline-flex items-center justify-center h-6 w-6 rounded bg-white/10">
                                          {renderNetworkIcon(n.value)}
                                        </span>
                                        <span>{n.label}</span>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                                <div className="grid gap-2">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <div className="relative flex-1">
                                        <span ref={prefixRef} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white whitespace-nowrap bg-[#000000] border border-input rounded inline-flex items-center h-10 px-2">
                                          {getNetworkBase(newLinkType)}
                                        </span>
                                        <Input
                                          className="pr-3 w-full"
                                          style={{ paddingLeft: `${prefixPadding}px` }}
                                          value={newLinkUrl}
                                          onChange={(e) => setNewLinkUrl(e.target.value)}
                                          placeholder={getNetworkSuffixPlaceholder(newLinkType)}
                                        />
                                      </div>
                                      <Button onClick={addSocialLink}>Добавить</Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </BottomSheet>
                        ) : (
                          <Sheet open={isAddLinkOpen} onOpenChange={setIsAddLinkOpen}>
                            <SheetContent side="right" className="w-1/2 sm:w-1/2 md:w-1/2 lg:w-1/2 max-w-none sm:max-w-none md:max-w-none lg:max-w-none h-screen p-0">
                              <div className="h-full flex flex-col">
                                <div className="flex-1 overflow-y-auto px-6 py-6">
                                  <div className="grid grid-cols-1 gap-3 items-start">
                                    <div className="pr-1">
                                      <div className="grid gap-2">
                                        {networks.map((n) => (
                                          <button
                                            key={n.value}
                                            type="button"
                                            onClick={() => setNewLinkType(n.value)}
                                            className={`w-full text-left px-3 py-2 rounded border transition-colors flex items-center gap-2 ${newLinkType === n.value ? 'bg-white/10 border-white/20' : 'border-white/10 hover:bg-white/5'}`}
                                          >
                                            <span className="inline-flex items-center justify-center h-6 w-6 rounded bg-white/10">
                                              {renderNetworkIcon(n.value)}
                                            </span>
                                            <span>{n.label}</span>
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="px-6 py-4 bg-[#111] border-t border-white/10">
                                  <div className="grid gap-2">
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <div className="relative flex-1">
                                          <span ref={prefixRef} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white whitespace-nowrap bg-[#000000] border border-input rounded inline-flex items-center h-9 px-2">
                                            {getNetworkBase(newLinkType)}
                                          </span>
                                          <Input
                                            className="pr-3 w-full"
                                            style={{ paddingLeft: `${prefixPadding}px` }}
                                            value={newLinkUrl}
                                            onChange={(e) => setNewLinkUrl(e.target.value)}
                                            placeholder={getNetworkSuffixPlaceholder(newLinkType)}
                                          />
                                        </div>
                                        <Button onClick={addSocialLink}>Добавить</Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </SheetContent>
                          </Sheet>
                        )
                      )}
                      {!!socialLinks.length && (
                        <div className="mt-2 grid gap-2">
                          {socialLinks.map((link) => (
                            <div key={link.id} className="w-full flex items-center justify-between rounded border border-input bg-[#000000] px-3 py-2">
                              <a href={link.url} target="_blank" rel="noreferrer" className="truncate text-sm hover:underline flex items-center gap-2">
                                <span className="inline-flex items-center justify-center h-6 w-6 rounded bg-white/10">
                                  {renderNetworkIcon(link.type)}
                                </span>
                                <span className="truncate">
                                  {(networks.find(n => n.value === link.type)?.label || link.type) + ": "}
                                  <span className="text-muted-foreground">{link.url}</span>
                                </span>
                              </a>
                              <button
                                type="button"
                                className="ml-3 inline-flex h-7 w-7 items-center justify-center rounded hover:bg-white/10"
                                aria-label="Удалить ссылку"
                                onClick={() => setSocialLinks((prev) => prev.filter((l) => l.id !== link.id))}
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm text-foreground">Режим тренера</span>
                        <Switch checked={trainerPricingEnabled} onCheckedChange={setTrainerPricingEnabled} />
                      </div>
                    </div>
                    {/* Pricing section */}
                    {trainerPricingEnabled && (
                    <div>
                      <Label>Указать цену</Label>
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        {[
                          { key: 'free', label: 'Бесплатно' },
                          { key: 'one_time', label: 'Одноразово' },
                          { key: 'recurring', label: 'Повторяющий' },
                        ].map((opt) => (
                          <button
                            key={opt.key}
                            type="button"
                            className={`h-9 rounded-md border text-sm transition-colors ${
                              priceType === opt.key ? 'bg-white/10 border-white/20' : 'bg-transparent border-white/10 hover:bg-white/5'
                            }`}
                            onClick={() => {
                              setPriceType(opt.key as 'free' | 'one_time' | 'recurring');
                              if (opt.key === 'free') {
                                setPrice("");
                                setRecurrence('');
                                setCustomDays("");
                              }
                              if (opt.key === 'one_time') {
                                setRecurrence('');
                                setCustomDays("");
                              }
                              if (opt.key === 'recurring') {
                                setRecurrence((prev) => prev ? prev : '7d');
                              }
                            }}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                      {(priceType === 'one_time' || priceType === 'recurring') && (
                        <>
                          {priceType === 'one_time' ? (
                            <div className="mt-2">
                              <Input
                                className="w-full no-spinner"
                                type="number"
                                min="0"
                                step="0.01"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="Цена"
                              />
                            </div>
                          ) : (
                            <div className="mt-2">
                              <div className="relative">
                                <Input
                                  className="w-full no-spinner pr-40"
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={price}
                                  onChange={(e) => setPrice(e.target.value)}
                                  placeholder="Цена"
                                />
                                <div className="absolute inset-y-0 right-2 flex items-center">
                                  <Select
                                    value={recurrence || '7d'}
                                    onValueChange={(v) => {
                                      setRecurrence(v as typeof recurrence);
                                    }}
                                  >
                                    <SelectTrigger className="h-7 text-xs px-2 border-0 bg-transparent hover:bg-white/5">
                                      <SelectValue placeholder="Период" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="7d">за 7 дней</SelectItem>
                                      <SelectItem value="1m">за 1 месяц</SelectItem>
                                      <SelectItem value="3m">за 3 месяца</SelectItem>
                                      <SelectItem value="6m">за 6 месяцев</SelectItem>
                                      <SelectItem value="1y">за 1 год</SelectItem>
                                      <SelectItem value="custom">Указать другую...</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              {recurrence === 'custom' && (
                                <div className="mt-2 relative">
                                  <Input
                                    className="no-spinner pr-14"
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={customDays}
                                    onChange={(e) => setCustomDays(e.target.value)}
                                    placeholder="Кол-во дней"
                                  />
                                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">/ дн.</span>
                                </div>
                              )}
                            </div>
                          )}
                          <style>{`
                            input.no-spinner::-webkit-outer-spin-button,
                            input.no-spinner::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
                            input.no-spinner[type=number] { -moz-appearance: textfield; }
                          `}</style>
                        </>
                      )}
                    </div>
                    )}
                    <div>
                      <Label>О себе</Label>
                      <div className="mt-1">
                        <TipTapEditor content={about} onChange={setAbout} placeholder="Расскажите о себе..." />
                      </div>
                    </div>
                    <div className="sticky bottom-[10px] left-0 right-0 z-30 px-2 py-2 bg-[#111] border-t border-white/10 rounded-none">
                      <div className="flex gap-2 justify-end pr-2">
                      <Button variant="outline" onClick={() => navigate(-1)}>Отмена</Button>
                      <Button onClick={save} disabled={isSaving}>{isSaving ? "Сохранение..." : "Сохранить"}</Button>
                      </div>
                    </div>
                  </div>

                  {/* Right: Preview image (all fields) */}
                  <div className="hidden md:flex items-center justify-center relative rounded-2xl p-4">
                    {/* Dotted radial gradient background */}
                    <div
                      className="absolute inset-0 z-0 rounded-2xl"
                      style={{
                        background: "#000000",
                        backgroundImage:
                          "radial-gradient(circle, rgba(255, 255, 255, 0.2) 1.5px, transparent 1.5px)",
                        backgroundSize: "30px 30px",
                        backgroundPosition: "0 0",
                      }}
                    />
                    <div className="relative z-10 max-w-[340px] w-full rounded-xl overflow-hidden shadow-lg bg-[#111]">
                      <img src="/src/assets/iphone-frame.jpg" alt="Превью" className="w-full h-auto" />
                      {/* Live overlay inside phone */}
                      <div className="absolute inset-0 pointer-events-none px-4 pb-6">
                        {/* Cover area with centered title */}
                        <div
                          className={`absolute top-6 left-6 right-6 h-16 rounded-t-[45px] rounded-b-md opacity-90 ${
                            coverVariants[selectedCoverIndex]?.className ?? ""
                          }`}
                          style={coverVariants[selectedCoverIndex]?.style}
                        >
                          <div className="h-full w-full flex items-center justify-center text-white font-semibold text-lg truncate px-2 text-center">
                            {title || "Название"}
                          </div>
                        </div>
                        <div className="absolute top-24 md:top-22 left-6 right-6 text-white space-y-3 md:space-y-2 pl-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="h-6 w-6 rounded-md bg-white/10 flex items-center justify-center text-[10px] font-semibold">
                              {(currentUser?.user?.username?.[0] || 'U').toUpperCase()}
                            </div>
                            <div className="text-sm font-medium truncate pl-1">{currentUser?.user?.username || "username"}</div>
                          </div>
                          <div className="text-sm opacity-90 truncate">{headline || "Заголовок"}</div>
                          <div className="text-xs opacity-80 overflow-hidden max-h-10">
                            {description || "Краткое описание"}
                          </div>
                          <div className="text-xs opacity-80 overflow-hidden max-h-16">
                            <div dangerouslySetInnerHTML={{ __html: about || "Расскажите о себе..." }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Dark scrollbar styles for left column scroll container */}
              <style>{`
                .left-scroll { scrollbar-width: thin; scrollbar-color: #444 #0a0a0a; }
                .left-scroll::-webkit-scrollbar { width: 10px; }
                .left-scroll::-webkit-scrollbar-track { background: #0a0a0a; border-radius: 9999px; }
                .left-scroll::-webkit-scrollbar-thumb { background: #444; border-radius: 9999px; }
                .left-scroll::-webkit-scrollbar-thumb:hover { background: #555; }
              `}</style>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CreatiumCreate;