import React, { useState } from "react";
import { View, Image, Pressable, Modal, ScrollView, Dimensions } from "react-native";
import { Typography } from "./Core";
import { X, Plus, ChevronRight, ShoppingBag } from "lucide-react-native";
import { useAppStore } from "../../store/useAppStore";

const { height, width } = Dimensions.get('window');

export interface DineMenuItem {
  id: string;
  name: string;
  price: number;
  desc?: string;
  image?: string;
}

export interface DineProps {
  id: string;
  title: string;
  description: string;
  image: string;
  menu?: DineMenuItem[];
}

export const DineCard = ({ item }: { item: DineProps }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { addToCart, setCartOpen } = useAppStore();

  const handleAddItem = (dish: DineMenuItem) => {
    addToCart({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      image: item.image // Use restaurant image as fallback
    });
    setCartOpen(true);
  };

  return (
    <View className="bg-[#0b0e14] rounded-premium overflow-hidden border border-white/10 mb-8 shadow-premium">
      <View className="relative h-72 w-full px-4 pt-4">
        <View className="w-full h-full rounded-2xl overflow-hidden shadow-2xl">
           <Image 
             source={{ uri: item.image }}
             className="w-full h-full"
             resizeMode="cover"
           />
        </View>
      </View>

      <View className="px-6 pt-6 pb-8">
        <View className="flex-row items-center justify-between mb-4">
           <View className="flex-1">
              <Typography weight="black" className="text-[26px] text-white uppercase tracking-tighter italic leading-none font-black">{item.title}</Typography>
              <View className="h-[2px] w-8 bg-indigo-500 mt-2 mb-2 rounded-full" />
           </View>
        </View>
        
        <Typography weight="medium" className="text-[11px] text-gray-400 tracking-[1.5px] uppercase leading-[18px] mb-8 font-medium">{item.description}</Typography>

        <Pressable 
           onPress={() => setModalVisible(true)}
           className="bg-indigo-600/10 border border-indigo-600/30 h-16 rounded-2xl flex-row items-center justify-center space-x-4 shadow-2xl active:bg-indigo-600/20"
        >
           <Typography weight="black" className="text-[12px] text-indigo-400 tracking-[3px] uppercase italic font-black">EXPLORE FULL MENU</Typography>
           <ChevronRight size={16} color="#818cf8" strokeWidth={3} />
        </Pressable>
      </View>

      <Modal
         animationType="slide"
         transparent={true}
         visible={modalVisible}
         onRequestClose={() => setModalVisible(false)}
      >
         <View className="flex-1 bg-black/95">
            <View style={{ paddingTop: 60 }} className="px-8 pb-10 flex-1">
               <View className="flex-row items-center justify-between mb-10">
                  <View>
                     <Typography weight="black" className="text-[10px] text-indigo-400 tracking-[4px] uppercase font-black">RESTAURANT MENU</Typography>
                     <Typography weight="black" className="text-4xl text-white italic tracking-tighter uppercase font-black">{item.title}</Typography>
                  </View>
                  <Pressable 
                     onPress={() => setModalVisible(false)}
                     className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl items-center justify-center active:bg-white/10"
                  >
                     <X size={20} color="white" />
                  </Pressable>
               </View>

               <ScrollView showsVerticalScrollIndicator={false}>
                  {(item.menu || []).map((dish) => (
                     <View key={dish.id} className="bg-white/5 border border-white/10 rounded-premium p-6 mb-6 flex-row items-center justify-between shadow-premium">
                        <View className="flex-1 mr-4">
                           <Typography weight="black" className="text-[18px] text-white italic tracking-tight uppercase font-black mb-1">{dish.name}</Typography>
                           <Typography weight="medium" className="text-[10px] text-gray-400 tracking-[1px] mb-4 font-medium">{dish.desc}</Typography>
                           <Typography weight="black" className="text-[20px] text-white italic font-black">₹{dish.price}</Typography>
                        </View>
                        
                        <Pressable 
                           onPress={() => handleAddItem(dish)}
                           className="w-14 h-14 bg-indigo-600 rounded-2xl items-center justify-center shadow-2xl shadow-indigo-600/40 active:bg-indigo-700"
                        >
                           <Plus size={24} color="white" strokeWidth={3} />
                        </Pressable>
                     </View>
                  ))}
               </ScrollView>

               <Pressable 
                   onPress={() => {
                      setModalVisible(false);
                      setCartOpen(true);
                   }}
                   className="bg-indigo-600 h-20 rounded-[28px] flex-row items-center justify-center space-x-6 mt-6 shadow-2xl shadow-indigo-600/40 active:bg-indigo-700"
                >
                   <Typography weight="black" className="text-[14px] text-white tracking-[5px] uppercase font-black italic">VIEW CART</Typography>
                   <ShoppingBag size={20} color="white" />
                </Pressable>
            </View>
         </View>
      </Modal>
    </View>
  );
};
