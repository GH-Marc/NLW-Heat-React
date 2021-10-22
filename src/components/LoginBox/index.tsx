import { useContext } from 'react';
import { AuthContext } from '../../contexts/auth';

import { VscGithubInverted } from 'react-icons/vsc';

import styles from './styles.module.scss';

export function LoginBox() {
  const { sign_in_url } = useContext(AuthContext);
  
  return (
    <div className={styles.login_box_wrapper}>
      <strong>Entre e compartilhe sua mensagem</strong>
      <a href={sign_in_url} className={styles.sign_in_with_github}>
        <VscGithubInverted size="24" />
        Entrar com GitHub
      </a>
    </div>
  )
}
