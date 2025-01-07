export type Participant = {
  id: number;
  name: string;
  role: string;
  profile_url: string;
};

type CastListProps = {
  participants: Participant[];
};

const CastList = ({ participants = [] }: CastListProps) => {
  const chunkedCast = [];
  for (let i = 0; i < participants.length; i += 3) {
    chunkedCast.push(participants.slice(i, i + 3));
  }

  return (
    <div className="flex flex-col">
      <h2 className="text-lg font-semibold px-4">출연/제작</h2>

      <div className="overflow-x-auto snap-x snap-mandatory">
        <div className="flex space-x-4 px-4">
          {chunkedCast.map((group, idx) => (
            <div
              key={idx}
              className="snap-center shrink-0 w-[calc(100vw-2rem)]"
            >
              <div className="grid grid-rows-3">
                {group.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center space-x-4 py-2 border-b border-gray-200"
                  >
                    <img
                      src={member.profile_url}
                      alt={member.name}
                      className="w-16 h-16 rounded-md object-cover"
                    />
                    <div>
                      <p className="font-semibold">{member.name}</p>
                      <p className="text-sm text-gray-500">
                        출연 {member.role === '' ? '' : `| ${member.role}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="opacity-0 w-0">.</div>
        </div>
      </div>
    </div>
  );
};

export default CastList;
