interface Props {
  title: string;
}

export default ({ title }: Props) => {
  return (
    <div className="text-2xl font-bold">{title}</div>
  );
};
