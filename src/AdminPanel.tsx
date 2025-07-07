import { useEffect, useState } from "react";
import { supabase } from "../supabase";

interface ConfigEntry {
  id: number;
  name: string;
  email: string;
  image_url: string;
  created_at?: string;
}

export default function AdminPanel() {
  const [data, setData] = useState<ConfigEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfigurations = async () => {
      const { data, error } = await supabase
        .from("configurations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching data:", error);
      } else {
        setData(data || []);
      }
      setLoading(false);
    };

    fetchConfigurations();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Full-width black bar */}
      <div className="w-full h-14 bg-black mt-10" />
  
      {/* Main content with padding */}
      <div className="px-8">
        <h1 className="text-xl font-semibold mt-14">Submitted Configurations</h1>
        <hr className="my-8 border-gray-300" />
  
        {loading ? (
          <p>Loading...</p>
        ) : data.length === 0 ? (
          <p>No configurations found.</p>
        ) : (
          <div className="space-y-4">
            {data.map((entry) => {
              const submittedDate = entry.created_at
                ? new Date(entry.created_at)
                : null;
              const formattedDate = submittedDate?.toLocaleDateString("en-GB");
              const formattedTime = submittedDate?.toLocaleTimeString("en-GB");
  
              return (
                <div
                  key={entry.id}
                   className="grid grid-cols-[500px_800px_190px_140px] items-center px-2 py-2 gap-4"
                >
                  {/* Image + Name */}
                  <div className="flex items-center gap-4 min-w-[180px]">
                    <a
                      href={entry.image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={entry.image_url}
                        alt="Screenshot"
                        className="w-14 h-14 rounded bg-gray-300 object-cover"
                      />
                    </a>
                    <div className="text-sm font-medium text-gray-800">
                      {entry.name}
                    </div>
                  </div>
  
                  {/* Email */}
                  <div className="flex items-center h-14">
                    <div className="text-sm text-gray-700">{entry.email}</div>
                  </div>
  
                  {/* Date */}
                  <div className="flex items-center h-14">
                    <div className="text-sm text-gray-600">
                      {formattedDate}
                    </div>
                  </div>
  
                  {/* Time */}
                  <div className="flex items-center h-14">
                    <div className="text-sm text-gray-600">
                      {formattedTime}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}  