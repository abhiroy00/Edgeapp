import React from 'react'

export default function Asset_History_Card() {
  return (
    <div className="p-8">
      {/* Header */}
      <div
        className="w-full mt-25 shadow-2xl rounded-2xl p-8 mb-10"
        style={{ backgroundColor: "#d8eefc" }}
      >
        <div className="flex flex-col md:flex-row md:justify-between gap-4">
          <p className="font-bold text-lg">
            Station : Pt Ram Prasad Bismil (PRPM)
          </p>
          <p className="font-bold text-lg">Division : Moradabad</p>
          <p className="font-bold text-lg">Zone : Northern Railway</p>
        </div>
      </div>

      {/* History Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-xl shadow-lg">
          <thead className="bg-blue-100 text-gray-800">
            <tr>
              <th className="border px-4 py-2 text-left">Date Time</th>
              <th className="border px-4 py-2 text-left">Problem</th>
              <th className="border px-4 py-2 text-left">Closing Date Time</th>
              <th className="border px-4 py-2 text-left">Block Taken</th>
              <th className="border px-4 py-2 text-left">Block Duration</th>
            </tr>
          </thead>
          <tbody>
            {/* Row 1 */}
            <tr className="hover:bg-gray-100">
              <td className="border px-4 py-2">25/01/2024 11:30</td>
              <td className="border px-4 py-2">
                Over Current observed <br />
                6.90 Amps against 5.5 Amps 53ANW
              </td>
              <td className="border px-4 py-2">26/01/2024 15:50</td>
              <td className="border px-4 py-2">No</td>
              <td className="border px-4 py-2">Nil</td>
            </tr>

            {/* Row 2 */}
            <tr className="hover:bg-gray-100">
              <td className="border px-4 py-2">25/01/2024 11:30</td>
              <td className="border px-4 py-2">
                Over Current observed <br />
                6.90 Amps against 5.5 Amps 53ANW
              </td>
              <td className="border px-4 py-2">26/01/2024 15:50</td>
              <td className="border px-4 py-2">No</td>
              <td className="border px-4 py-2">Nil</td>
            </tr>

            {/* Row 3 */}
            <tr className="hover:bg-gray-100">
              <td className="border px-4 py-2">25/01/2024 11:30</td>
              <td className="border px-4 py-2">
                Over Current observed <br />
                6.90 Amps against 5.5 Amps 53ARW
              </td>
              <td className="border px-4 py-2">26/01/2024 15:50</td>
              <td className="border px-4 py-2">No</td>
              <td className="border px-4 py-2">Nil</td>
            </tr>

            {/* Row 4 */}
            <tr className="hover:bg-gray-100">
              <td className="border px-4 py-2">25/01/2024 11:30</td>
              <td className="border px-4 py-2">
                Over Current observed <br />
                6.90 Amps against 5.5 Amps 53ARW
              </td>
              <td className="border px-4 py-2">26/01/2024 15:50</td>
              <td className="border px-4 py-2">No</td>
              <td className="border px-4 py-2">Nil</td>
            </tr>

            {/* Row 5 */}
            <tr className="hover:bg-gray-100">
              <td className="border px-4 py-2">25/01/2024 11:30</td>
              <td className="border px-4 py-2">
                Over Current observed <br />
                6.90 Amps against 5.5 Amps
              </td>
              <td className="border px-4 py-2">26/01/2024 15:50</td>
              <td className="border px-4 py-2">No</td>
              <td className="border px-4 py-2">Nil</td>
            </tr>

            {/* Row 6 */}
            <tr className="hover:bg-gray-100">
              <td className="border px-4 py-2">25/01/2024 11:30</td>
              <td className="border px-4 py-2">
                Over Current observed <br />
                6.90 Amps against 5.5 Amps
              </td>
              <td className="border px-4 py-2">26/01/2024 15:50</td>
              <td className="border px-4 py-2">No</td>
              <td className="border px-4 py-2">Nil</td>
            </tr>

            {/* Row 7 */}
            <tr className="hover:bg-gray-100">
              <td className="border px-4 py-2">25/01/2024 11:30</td>
              <td className="border px-4 py-2">
                Over Current observed <br />
                6.90 Amps against 5.5 Amps
              </td>
              <td className="border px-4 py-2">26/01/2024 15:50</td>
              <td className="border px-4 py-2">No</td>
              <td className="border px-4 py-2">Nil</td>
            </tr>

            {/* Row 8 */}
            <tr className="hover:bg-gray-100">
              <td className="border px-4 py-2">25/01/2024 11:30</td>
              <td className="border px-4 py-2">
                Over Current observed <br />
                6.90 Amps against 5.5 Amps
              </td>
              <td className="border px-4 py-2">26/01/2024 15:50</td>
              <td className="border px-4 py-2">No</td>
              <td className="border px-4 py-2">Nil</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
