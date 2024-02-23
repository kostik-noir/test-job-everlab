interface Props {
  onClick: () => void;
}

export default ({ onClick }: Props) => {
  return (
    <button type="button" className="btn btn-blue" onClick={onClick}>Upload new file</button>
  );
}
