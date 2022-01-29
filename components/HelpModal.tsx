import Modal from "./Modal";
import Tile from "./Tile";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpModal(props: Props) {
  const { isOpen, onClose } = props;
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Title>Cara Bermain</Modal.Title>
      <div className="text-sm">
        <p className="mb-2">
          kontlo
        </p>
      </div>
    </Modal>
  );
}
