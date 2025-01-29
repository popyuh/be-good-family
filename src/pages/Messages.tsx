import { Layout } from "@/components/layout/Layout";
import { MessageBoard } from "@/components/messages/MessageBoard";

const Messages = () => {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-4xl font-bold mb-6">Message Board</h1>
        <MessageBoard />
      </div>
    </Layout>
  );
};

export default Messages;