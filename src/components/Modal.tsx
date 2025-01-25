interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const Modal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[80%] max-w-xs">
        <div className="text-lg font-semibold text-center pt-4 pb-1">
          {title}
        </div>
        <div className="text-center text-sm px-6 pb-3">{message}</div>
        <div className="flex border-t">
          <button
            onClick={onCancel}
            className="flex-1 py-3 text-hotPink hover:bg-gray-100 rounded-bl-lg"
          >
            취소
          </button>
          <div className="w-[1px] bg-gray-200" />
          <button
            onClick={onConfirm}
            className="flex-1 py-3 text-hotPink hover:bg-gray-100 rounded-br-lg"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};
