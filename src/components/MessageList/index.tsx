import { useEffect, useState } from 'react';
import io from 'socket.io-client';

import { api } from '../../services/api';

import styles from './styles.module.scss';

import logoImg from '../../assets/logo.svg';

type Message = {
  id: string;
  text: string;
  user: {
    name: string;
    avatar_url: string;
  }
}

const messages_queue: Message[] = [];

const socket = io('http://localhost:4000');

socket.on('new_message', (newMessage: Message) => {
  messages_queue.push(newMessage);
});

export function MessageList() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    setInterval(() => {
      if (messages_queue.length > 0) {
        setMessages(prevState => [
          messages_queue[0],
          prevState[0],
          prevState[1],
        ].filter(Boolean))

        messages_queue.shift()
      }
    }, 3000)
  }, []);

  useEffect(() => {
    api.get<Message[]>('messages/last3').then(response => {
      setMessages(response.data)
    });
  }, []);

  return (
    <div className={styles.message_list_wrapper}>
      <img src={logoImg} alt="DoWhile 2021" />

      <ul className={styles.message_list}>
        {messages.map(message => {
          return (
            <li className={styles.message} key={message.id}>
              <p className={styles.message_content}>{message.text}</p>
            
              <div className={styles.message_user}>
                <div className={styles.user_image}>
                  <img src={message.user.avatar_url} alt={message.user.name} />
                </div>
                <span>{message.user.name}</span>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
