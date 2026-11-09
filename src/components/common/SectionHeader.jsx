export default function SectionHeader({ kicker, title, desc, action }) {
  return (
    <div className="section-head">
      <div>
        <div className="eyebrow">{kicker}</div>
        <h2>{title}</h2>
        <p>{desc}</p>
      </div>
      {action}
    </div>
  );
}
