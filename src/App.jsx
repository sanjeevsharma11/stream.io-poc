import React, { useState, useEffect } from 'react';
import { StreamChat } from 'stream-chat';
import {
  Chat,
  Channel,
  Window,
  ChannelHeader,
  MessageInput,
  MessageList,
  ChannelList,
} from 'stream-chat-react';
// import css
import 'stream-chat-react/dist/css/index.css';
import Chance from 'chance';

const chance = new Chance();




const App = () => {
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    async function initChat() {
      const client = StreamChat.getInstance('qk4nn7rpcn75');
      const user = {
        id: chance.guid(),
        name: chance.name(),
        image: chance.avatar(),
      }
      client.connectUser(user, client.devToken(user.id));

      const channel = client.channel(
        'messaging',
        'stream-chat',
        {
          image:
            'https://cdn.chrisshort.net/testing-certificate-chains-in-go/GOPHER_MIC_DROP.png',    
          name: 'stream.io POC',
        },
      );

      await channel.create();
      channel.addMembers([user.id]);

      setChannel(channel);


      setChatClient(client);
    }

    initChat();

    return () => {
      if (chatClient) {
        chatClient.disconnectUser();
      }
    }
  }, []);

  if (!chatClient || !channel) return <div>Loading...</div>;

  return (
    <div>
      <Chat client={chatClient} theme={'messaging light'}>
        <ChannelList />

        <Channel channel={channel}>
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput />
          </Window>
        </Channel>
      </Chat>
    </div>
  );
};

export default App;
