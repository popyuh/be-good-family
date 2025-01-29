import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, ListCheck, Gift } from "lucide-react";
import { ShoppingGrocery } from "@/components/shopping/ShoppingGrocery";
import { ShoppingNeeds } from "@/components/shopping/ShoppingNeeds";
import { ShoppingWants } from "@/components/shopping/ShoppingWants";

const Shopping = () => {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-4 md:p-6">
        <h1 className="text-2xl md:text-4xl font-bold mb-6">Shopping Lists</h1>
        
        <Tabs defaultValue="grocery" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="grocery" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden md:inline">Grocery</span>
            </TabsTrigger>
            <TabsTrigger value="needs" className="flex items-center gap-2">
              <ListCheck className="h-4 w-4" />
              <span className="hidden md:inline">Needs</span>
            </TabsTrigger>
            <TabsTrigger value="wants" className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              <span className="hidden md:inline">Wants</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="grocery">
            <ShoppingGrocery />
          </TabsContent>

          <TabsContent value="needs">
            <ShoppingNeeds />
          </TabsContent>

          <TabsContent value="wants">
            <ShoppingWants />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Shopping;