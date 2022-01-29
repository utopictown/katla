import Link from "./Link";
import Modal from "./Modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// TODO: feature parity with wordle
export default function SettingsModal(props: Props) {
  function handleReset() {
    localStorage.removeItem("katla:gameState");
    localStorage.removeItem("katla:gameStats");
    localStorage.removeItem("katla:lastHash");
    window.location.reload();
  }

  const { isOpen, onClose } = props;
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Title>Informasi</Modal.Title>
      <p className="mb-4">
        <strong>Kontlo</strong> merupakan parodi dan atau imitasi dari{" "}
        <a
          href="https://katla.vercel.app/"
          className="text-green-600 hover:text-green-700"
        >
          katla
        </a>
      </p>
    </Modal>
  );
}
