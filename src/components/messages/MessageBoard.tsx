import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageCircle,
  Users,
  Send,
  Plus
} from "lucide-react";
import { MessageGroup } from "./MessageGroup";
import { MessageThread } from "./MessageThread";

type Message = {
  id: string;
  content: string;
  author: string;
  timestamp: Date;
  emoji: string;
  color: string;
};

type Group = {
  id: string;
  name: string;
  messages: Message[];
};

const DEMO_DATA: Group[] = [
  {
    id: "1",
    name: "General",
    messages: [
      {
        id: "1",
        content: "Welcome to the family message board!",
        author: "Mom",
        timestamp: new Date(),
        emoji: "👩",
        color: "#FFB6C1"
      }
    ]
  },
  {
    id: "2",
    name: "Shopping List",
    messages: [
      {
        id: "2",
        content: "Don't forget to add items you need!",
        author: "Dad",
        timestamp: new Date(),
        emoji: "👨",
        color: "#87CEEB"
      }
    ]
  }
];

export const MessageBoard = () => {
  const [groups, setGroups] = useState<Group[]>(DEMO_DATA);
  const [newGroupName, setNewGroupName] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<Group>(groups[0]);

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return;
    
    const newGroup: Group = {
      id: (groups.length + 1).toString(),
      name: newGroupName,
      messages: []
    };
    
    setGroups([...groups, newGroup]);
    setNewGroupName("");
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const newMsg: Message = {
      id: (selectedGroup.messages.length + 1).toString(),
      content: newMessage,
      author: "You", // In a real app, this would come from user context
      timestamp: new Date(),
      emoji: "😊", // In a real app, this would come from user preferences
      color: "#98FB98" // In a real app, this would come from user preferences
    };

    const updatedGroups = groups.map(group => 
      group.id === selectedGroup.id 
        ? { ...group, messages: [...group.messages, newMsg] }
        : group
    );

    setGroups(updatedGroups);
    setSelectedGroup(updatedGroups.find(g => g.id === selectedGroup.id)!);
    setNewMessage("");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Groups Section */}
      <Card className="p-4 md:col-span-1">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5" />
          <h2 className="font-semibold">Groups</h2>
        </div>
        
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="New group name"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
          />
          <Button size="icon" onClick={handleCreateGroup}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-300px)]">
          {groups.map(group => (
            <MessageGroup
              key={group.id}
              group={group}
              isSelected={selectedGroup.id === group.id}
              onClick={() => setSelectedGroup(group)}
            />
          ))}
        </ScrollArea>
      </Card>

      {/* Messages Section */}
      <Card className="p-4 md:col-span-3 flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="h-5 w-5" />
          <h2 className="font-semibold">{selectedGroup.name}</h2>
        </div>

        <ScrollArea className="flex-1 h-[calc(100vh-400px)] mb-4">
          <div className="space-y-4">
            {selectedGroup.messages.map(message => (
              <MessageThread key={message.id} message={message} />
            ))}
          </div>
        </ScrollArea>

        <div className="flex gap-2">
          <Textarea
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="resize-none"
          />
          <Button size="icon" onClick={handleSendMessage}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};