import {getUserManual, useText} from '@localization';
import {useAppSelector} from '@redux/reduxHook';
import {useState, useEffect} from 'react';

const manual = {
  en: `🧭 User Manual – Fearless Code Companion

🧠 Main Chat – Your Personal Fearless Code

This is the heart of the app — where you interact directly with the Fearless Code.

🟢 Best way to use it:

Ask clear, detailed questions about your inner state, blockages, fears, or life situations in general.

Use “I” statements and describe what’s happening inside you (e.g., “I’m stuck in fear of failure when I think about changing jobs”).
Be honest and specific — the system works best when it has real, current data from you. Provide as much information as you can. Think of it as talking to a good friend.

🧩 How to ask better questions:
Instead of:

“Why am I like this?”
Try:
“Why do I always fall back into fear when I try something new, and how is this connected to my thought process?”

This allows the system to detect your automatic loops, identify your programming, and explain the inner cause-effect chain based on the Fearless Code.

If you do not receive the desired answer, try formulating differently or ask to give a more detailed answer to your question. You can also counter critically by saying "This is not what I meant, I wanted to know..." or "I thought that..." which means you can indicate to the system that the answer was incomplete or unclear.

🤖 Agent Chat – Topic-Specific Support

In this section, you’ll find dedicated Agents for key life areas like:

🔗 Relationships
🎯 Career
🔄 Self Development
💡 Purpose & Vision
⚡ Emergency Situations

📌 Use these agents when:

• You want tailored input for a specific area.
• You need support applying the Fearless Code in practical life decisions.
• You’re seeking inspired actions despite inner resistance (e.g. “I want to break up, but I’m afraid to be alone.”)

🧩 How to ask better questions:
Instead of:

“What should I do with my job?”
Try:
“Every time I think about quitting, I feel tension and fear. What loop am I trapped in, and how do I take action anyway?”

💾 Chat Management (Red + Icon)

You can:

📝 Rename your chats
 💾 Save your chats for future access
📤 Export your chat as PDF for offline use
🗑️ Delete chats you no longer need

⚠️ Warning: Unsaved chats are deleted daily. If a session was meaningful, save it immediately.

📚 Resources Section

This section offers:

• Manuals, guides and inspirations
• Quick PDFs you can download or print
• Additional material to deepen your system understanding

👤 Profile Section

From here, you can:

🌍 Change the app language
🗂️ View and organize your saved chats
✏️ Edit your profile information


If you have any questions about the app please send us an email to: info@fearlesscode.de
`,
  de: `🧭 Anleitung – Fearless Code Companion

🧠 Haupt Chat – Dein persönlicher Fearless Code

Das ist das Herzstück der App – hier kannst du direkt mit dem Fearless Code interagieren.

🟢 So nutzt du den Chat am besten:

Stell klare, detaillierte Fragen zu deinem inneren Zustand, deinen Blockaden, Ängsten oder Lebenssituationen im Allgemeinen. 

Verwende „Ich“-Aussagen und beschreibe, was in dir vorgeht (z. B. „Ich habe Angst vor dem Scheitern, wenn ich darüber nachdenke, meinen Job zu wechseln“).

Sei ehrlich und konkret – das System funktioniert am besten, wenn es echte, aktuelle Daten von dir hat. Stelle so viel Informationen wie möglich zur Verfügung. Stell dir einfach vor, du würdest mit einem guten Freund reden.

🧩 Wie du bessere Fragen stellst:
Anstatt:

„Warum bin ich so?“
Versuch es mit:
„Warum verfalle ich immer wieder in Angst, wenn ich etwas Neues ausprobiere, und wie hängt das mit meinem Denkprozess zusammen?“

Dadurch kann das System deine automatischen Schleifen erkennen, deine Programmierung identifizieren und die innere Ursache-Wirkungs-Kette basierend auf dem Fearless Code erklären.

Wenn du nicht die gewünschte Antwort bekommst, versuche es mit einer anderen Formulierung oder bitte um eine ausführlichere Antwort auf deine Frage. Du kannst auch kritisch reagieren, indem du sagst: „Das habe ich nicht gemeint, ich wollte wissen ...” oder „Ich dachte, dass ...”, um dem System zu zeigen, dass die Antwort unvollständig oder unklar war.

🤖 Agent Chat – Themenspezifische Unterstützung

In diesem Abschnitt findest du spezielle Agenten für wichtige Lebensbereiche wie:

🔗 Beziehungen
🎯 Karriere
🔄 Selbstentwicklung
💡 Lebensinn & Vision
⚡ Notfallsituationen

📌 Nutze diese Agenten, wenn:

• du maßgeschneiderte Inputs für einen bestimmten Bereich wünschst.
• du Unterstützung bei der Anwendung des Fearless Code in praktischen Lebensentscheidungen brauchst.
• du trotz innerem Widerstand nach inspirierten Handlungen suchst (z. B. „Ich möchte mich trennen, habe aber Angst, allein zu sein.“)

🧩 Wie du bessere Fragen stellst:
Anstatt:

„Was soll ich mit meinem Job machen?“
Versuch:
„Jedes Mal, wenn ich darüber nachdenke, zu kündigen, spüre ich Anspannung und Angst. In welcher Schleife stecke ich fest und wie kann ich trotzdem aktiv werden?“

💾 Chat-Verwaltung (Rotes + Icon)

Du kannst:

📝 Deine Chats umbenennen
 💾 Deine Chats für den späteren Zugriff speichern
📤 Deine Chats als PDF exportieren
🗑️ Chats löschen, die du nicht mehr brauchst

⚠️ Achtung: Nicht gespeicherte Chats werden täglich gelöscht. Wenn eine Sitzung wichtig war, speichere sie am besten gleich.

📚 Abschnitt „Ressourcen“

Dieser Abschnitt bietet:

• Hilfestellungen, Anleitungen und Inspirationen
• Kurze PDFs, die du runterladen oder ausdrucken kannst
• Zusätzliches Material, um dein Verständnis des Systems zu vertiefen

👤 Profilbereich

Hier kannst du:

🌍 Die Sprache der App ändern
🗂️ Deine gespeicherten Chats anzeigen und organisieren
✏️ Deine Profilinformationen bearbeiten


Wenn du Fragen zur App hast, schick uns bitte eine E-Mail an: info@fearlesscode.de`,
};

function useGetUserManual() {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const currentLanguage = useAppSelector(state => state?.app?.currentLanguage);
  const {TEXT} = useText();

  useEffect(() => {
    // (async () => {
    //   setLoading(true);
    //   try {
    //     const res = await getUserManual(currentLanguage);
    //     setContent(res);
    //   } catch (error) {
    //     setContent(TEXT.INFO_ERROR);
    //   } finally {
    //     setLoading(false);
    //   }
    // })();
    if (currentLanguage) {
      setContent(manual?.[currentLanguage] || manual?.['en']);
    } else {
      setContent(manual?.['en']);
    }
  }, [currentLanguage]);

  return {content, loading};
}

export default useGetUserManual;
