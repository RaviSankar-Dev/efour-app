import { View, Pressable, Linking, Image } from "react-native";
import { Typography } from "./Core";
import { Instagram, Facebook, Youtube, MapPin, Phone, ArrowUp, Zap } from "lucide-react-native";
import { useRouter } from "expo-router";

export const Footer = ({ onBackToTop }: { onBackToTop?: () => void }) => {
  const router = useRouter();

  return (
    <View className="bg-[#000000] pt-4 pb-4 px-6 border-t border-white/10">
      {/* BRAND & DESCRIPTION SECTION */}
      <View className="mb-6">
        <View className="mb-4">
           {/* LOGO - SOLO PURITY */}
           <Image 
              source={require('../../../assets/images/E4_LOGO_NEW.jpeg')} 
              style={{ width: 140, height: 120 }} 
              resizeMode="contain" 
           />
        </View>

        <Typography weight="medium" className="text-[12px] text-gray-400 leading-[22px] italic uppercase tracking-[1.5px] max-w-[90%] mb-8 font-medium">
          REDEFINING ENTERTAINMENT THROUGH WORLD-CLASS EXPERIENCES, PREMIUM DINING, AND HEART-POUNDING ATTRACTIONS.
        </Typography>

        <View className="flex-row items-center gap-5">
          {[
            { Icon: Instagram, link: "https://www.instagram.com/efoureluru?igsh=MWhlMGJ2ZjdyZGZicQ==", color: "#e1306c", bg: "bg-pink-500/10", border: "border-pink-500/20" },
            { Icon: Facebook, link: "https://www.facebook.com/share/18QsT1sGaq/", color: "#1877f2", bg: "bg-blue-600/10", border: "border-blue-600/20" },
            { Icon: Youtube, link: "https://youtube.com/@efoureluru", color: "#ff0000", bg: "bg-red-600/10", border: "border-red-600/20" }
          ].map((social, i) => (
            <Pressable 
              key={i} 
              onPress={() => social.link && Linking.openURL(social.link)}
              className={`w-10 h-10 items-center justify-center ${social.bg} border ${social.border} rounded-xl active:scale-90 active:bg-opacity-40 shadow-2xl transition-all`}
            >
              <social.Icon size={18} stroke={social.color} strokeWidth={2.5} />
            </Pressable>
          ))}
        </View>
      </View>

      <View className="h-[1px] w-full bg-white/5 mb-8" />

      {/* NAVIGATION MATRIX */}
      <View className="flex-row justify-between mb-12">
        <View style={{ flex: 1 }}>
          <View className="mb-6">
            <Typography weight="black" className="text-[11px] text-indigo-400 tracking-[3px] uppercase font-black">QUICK LINKS</Typography>
            <View className="w-10 h-1 bg-indigo-500/40 rounded-full mt-2" />
          </View>
          <View className="space-y-4">
            {['YOUR TICKETS', 'DINE', 'DOME'].map((link) => (
               <Pressable
                 key={link}
                 onPress={() => {
                   if (link === 'YOUR TICKETS') router.push('/tickets');
                   if (link === 'DINE') router.push('/(tabs)/dine');
                   if (link === 'DOME') router.push('/(tabs)/dome');
                 }}
                 className="py-1"
               >
                 <Typography weight="bold" className="text-[13px] text-white/60 tracking-[2px] uppercase font-bold">{link}</Typography>
               </Pressable>
            ))}
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <View className="mb-6">
            <Typography weight="black" className="text-[11px] text-indigo-400 tracking-[3px] uppercase font-black">INFORMATION</Typography>
            <View className="w-10 h-1 bg-indigo-500/40 rounded-full mt-2" />
          </View>
          <View className="space-y-4">
            {['ABOUT US', 'PRIVACY POLICY', 'TERMS OF USE'].map((link) => (
              <Pressable key={link} onPress={() => {
                if (link === 'ABOUT US') router.push('/about');
                if (link === 'PRIVACY POLICY') router.push('/privacy');
                if (link === 'TERMS OF USE') router.push('/terms');
              }}
                className="py-1"
              >
                <Typography weight="bold" className="text-[13px] text-white/60 tracking-[2px] uppercase font-bold">{link}</Typography>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      {/* CONTACT INFO REFINED */}
      <View className="bg-white/5 rounded-[40px] p-8 space-y-12 mb-10 border border-white/10 shadow-premium">
        <Pressable 
          className="active:opacity-70"
          onPress={() => Linking.openURL('https://maps.app.goo.gl/vt9Y6CR3inDZ6yuX9?g_st=aw')}
        >
          <View className="flex-row items-center">
            <View className="w-14 h-14 items-center justify-center bg-orange-500/10 rounded-[24px] border border-orange-500/20 shadow-2xl mr-6">
              <MapPin size={24} stroke="#f97316" strokeWidth={2.5} />
            </View>
            <View className="flex-1">
              <Typography weight="black" className="text-[10px] text-white/30 tracking-[3px] uppercase mb-2 font-black">OUR LOCATION</Typography>
              <Typography weight="bold" className="text-[13px] text-white/90 leading-[20px] tracking-[1.5px] uppercase font-bold">
                OPP TO NEW RTC MAIN BUS STAND, NR PETA, ELURU
              </Typography>
            </View>
          </View>
        </Pressable>

        <Pressable 
          className="active:opacity-70"
          onPress={() => Linking.openURL('tel:7036923456')}
        >
          <View className="flex-row items-center">
            <View className="w-14 h-14 items-center justify-center bg-indigo-500/10 rounded-[24px] border border-indigo-500/20 shadow-2xl mr-6">
              <Phone size={24} stroke="#6366f1" strokeWidth={2.5} />
            </View>
            <View className="flex-1">
              <Typography weight="black" className="text-[10px] text-indigo-400/50 tracking-[3px] uppercase mb-2 font-black">24/7 HELPLINE</Typography>
              <Typography weight="black" className="text-[24px] text-white tracking-[3px] uppercase font-black italic">70369 23456</Typography>
            </View>
          </View>
        </Pressable>
      </View>

      <View className="items-center mb-6">
        <Typography weight="bold" className="text-[8px] text-white/20 text-center leading-[14px] tracking-[2px] uppercase font-bold">
          © 2026 EFOUR ELURU. ALL RIGHTS RESERVED BY{"\n"}
          <Typography weight="black" className="text-white/40 text-[9px] font-black"> JAYANARAYANA KURETI</Typography>
        </Typography>
      </View>

      <View id="footer-branding-row" className="flex-row items-center justify-between mb-4" style={{ overflow: 'visible' }}>
        <View className="bg-white/5 border border-white/10 px-3 h-10 rounded-full flex-row items-center space-x-2 shadow-2xl">
          <Typography weight="black" className="text-[7.5px] text-white/30 tracking-[1.5px] uppercase font-black">STACKVIL TECHNOLOGIES</Typography>
          <Zap size={14} stroke="#6366f1" fill="#6366f1" />
        </View>

        <Pressable 
           onPress={() => onBackToTop?.()}
           className="flex-row items-center space-x-3 bg-yellow-400/10 px-4 h-11 rounded-full border border-yellow-400/30 active:bg-yellow-400/20 shadow-2xl"
        >
          <Typography weight="black" className="text-[7.5px] text-yellow-400 tracking-[1.5px] uppercase font-black">BACK TO TOP</Typography>
          <View className="w-8 h-8 items-center justify-center bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/40">
            <ArrowUp size={14} stroke="black" strokeWidth={4} />
          </View>
        </Pressable>
      </View>

      <View className="h-[1px] w-full bg-white/5 mb-4" />
      <View className="flex-row items-center justify-between px-2 pb-2">
        <Typography weight="black" className="text-[9px] text-white/10 tracking-[1.5px] uppercase font-black">EFOUR ELURU @ 2026</Typography>
        <Typography weight="black" className="text-[9px] text-white/10 tracking-[1.5px] uppercase font-black">UNTIL 11:00 PM</Typography>
        <Typography weight="black" className="text-[9px] text-white/10 tracking-[1.5px] uppercase font-black">NR PETA, ELURU</Typography>
      </View>
    </View>
  );
};
