import Image from "next/image";
import styles from "./page.module.css";
import Interface from "./components/interface";

export default function Home() {

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Interface />
       
      </main>
      <footer style={{
        textAlign:"center",
        margin:"10px"
        
      }}>
        Feito por Gustavo Santana, Gustavo Nicacio e Vitor Fengler
      </footer>
    </div>
  );
}
