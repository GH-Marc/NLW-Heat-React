import { useContext, useState, FormEvent } from 'react';
import { AuthContext } from '../../contexts/auth';

import { VscGithubInverted, VscSignOut } from 'react-icons/vsc';

import styles from './styles.module.scss';
import { api } from '../../services/api';

export function SendMessageForm() {
  const { user, sign_out } = useContext(AuthContext);
  const [message, setMessage] = useState('');

  async function handle_send_message(event: FormEvent) {
    event.preventDefault();

    if (!message.trim()) {
      return;
    }

    await api.post('messages', { message });

    setMessage('');
  }

  return (
    <div className={styles.send_message_form_wrapper}>
      <button onClick={sign_out} className={styles.sign_out_button}>
        <VscSignOut size="32" />
      </button>

      <header className={styles.user_information}>
        <div className={styles.user_image}>
          <img src={user?.avatar_url} alt={user?.name} />
        </div>
        <strong className={styles.user_name}>
          {user?.name}
        </strong>
        <span className={styles.user_github}>
          <VscGithubInverted size="16" />
          {user?.login}
        </span>
      </header>

      <form onSubmit={handle_send_message} className={styles.send_message_form}>
        <label htmlFor="message">Mensagem</label>
        <textarea
          name="message"
          id="message"
          placeholder="Qual sua expectativa para o evento?"
          onChange={event => setMessage(event.target.value)}
          value={message}
        />

        <button type="submit">Enviar mensagem</button>
      </form>
    </div>
  )
}
