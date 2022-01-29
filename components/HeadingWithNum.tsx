export default function HeadingWithNum(props: { num: string | number }) {
  return (
    <span>
      Kontlo
      <sup className="-top-4 tracking-tight" style={{ fontSize: "45%" }}>
        #{props.num}
      </sup>
    </span>
  );
}
