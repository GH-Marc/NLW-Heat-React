import { useContext } from 'react';
import { AuthContext } from './contexts/auth';

import { LoginBox } from './components/LoginBox';
import { MessageList } from './components/MessageList';
import { SendMessageForm } from './components/SendMessageForm';

import styles from './App.module.scss';

export function App() {
  const { user } = useContext(AuthContext);

  return (
    <main className={`${styles.content_wrapper} ${ !!user ? styles.content_signed : ''}`}>
      <MessageList />
      { !!user ? <SendMessageForm /> : <LoginBox /> }
    </main>
  )
}