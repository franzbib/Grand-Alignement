import type { Event } from "../types/game";

type JournalProps = {
  events: Event[];
};

export function Journal({ events }: JournalProps) {
  return (
    <section className="panel journal" aria-labelledby="journal-title">
      <h2 id="journal-title">Journal des conséquences</h2>
      <ol>
        {events.map((event) => (
          <li key={event.id}>
            <span>Tour {event.turn}</span>
            <strong>{event.title}</strong>
            <p>{event.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
