import React, { useEffect, useState } from "react";
import "./SelectionDate.css";
import Calendar from "react-calendar";
const API_URL = import.meta.env.VITE_API_URL;

const SelectionDate = ({ duration, setupId, setStep, user }) => {
  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 14);

  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [setupInfo, setSetupInfo] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reserving, setReserving] = useState(false);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchSetup = async () => {
      try {
        const response = await fetch(`${API_URL}/setups`);
        const data = await response.json();
        const setup = data.find((setup) => setup.id === setupId);
        setSetupInfo(setup);
      } catch (err) {
        console.error("Error fetching setup:", err);
      }
    };

    if (setupId) {
      fetchSetup();
    }
  }, [setupId]);

  const handleDateChange = async (date) => {
    setSelectedDate(date);
    setLoading(true);
    setError(null);
    setSelectedSlot(null);

    try {
      const formattedDate = formatDate(date);

      let deviceType = "pc";
      if (setupInfo) {
        if (setupInfo.name.toLowerCase().includes("pc")) {
          deviceType = "pc";
        } else if (setupInfo.name.toLowerCase().includes("playstation")) {
          deviceType = "sony";
        } else if (setupInfo.name.toLowerCase().includes("moto")) {
          deviceType = "moto";
        }
      }

      const response = await fetch(`${API_URL}/available-slots`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          device_type: deviceType,
          reservation_date: formattedDate,
          duration_hours: duration,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Greska pri ucitavanju dostupnih termina",
        );
      }

      const data = await response.json();
      setAvailableSlots(data);
    } catch (err) {
      setError(err.message);
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReservation = async () => {
    if (selectedSlot === null || !selectedDate || !setupInfo) {
      setError("Morate izabrati termin!");
      return;
    }
    if (!user) {
      setError("Morate biti prijavljeni da biste napravili rezervaciju!");
      return;
    }

    setReserving(true);
    setError(null);

    try {
      const slot = availableSlots[selectedSlot];
      const formattedDate = formatDate(selectedDate);

      let deviceType = "pc";
      if (setupInfo.name.toLowerCase().includes("pc")) {
        deviceType = "pc";
      } else if (setupInfo.name.toLowerCase().includes("playstation")) {
        deviceType = "sony";
      } else if (setupInfo.name.toLowerCase().includes("moto")) {
        deviceType = "moto";
      }

      const availableDevicesResponse = await fetch(
        `${API_URL}/devices/available`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            device_type: deviceType,
            reservation_date: formattedDate,
            start_time: slot.start_time,
            duration_hours: duration,
          }),
        },
      );

      if (!availableDevicesResponse.ok) {
        const errorData = await availableDevicesResponse.json();
        throw new Error(
          errorData.error || "Greška pri pronalaženju dostupnog uređaja",
        );
      }

      const availableDevices = await availableDevicesResponse.json();

      if (availableDevices.length === 0) {
        throw new Error("Nema dostupnih uređaja za odabrani termin");
      }

      const device = availableDevices[0];
      const deviceIdField = `${deviceType}_id`;
      const deviceId = device[deviceIdField];

      const totalPrice = setupInfo.basePrice * duration;

      const userId = user.user_id;

      console.log(userId);

      const reservationResponse = await fetch(`${API_URL}/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          setup_id: setupId,
          device_type: deviceType,
          device_id: deviceId,
          reservation_date: formattedDate,
          start_time: slot.start_time,
          duration_hours: duration,
          total_price: totalPrice,
        }),
      });

      if (!reservationResponse.ok) {
        const errorData = await reservationResponse.json();
        throw new Error(errorData.error || "Greška pri kreiranju rezervacije");
      }

      const reservation = await reservationResponse.json();

      alert(
        `Uspešno rezervisano! Termin: ${slot.start_time.slice(0, 5)} - ${slot.end_time.slice(0, 5)}`,
      );

      setStep(4);
    } catch (err) {
      console.error("Došlo je do greške prilikom rezervacije: " + err.message);
      setError(err.message);
    } finally {
      setReserving(false);
    }
  };

  return (
    <div className="selection-date">
      <Calendar
        minDate={today}
        maxDate={maxDate}
        className={"calendar"}
        prev2Label={null}
        next2Label={null}
        minDetail="month"
        maxDetail="month"
        onChange={handleDateChange}
        value={selectedDate}
      />

      {selectedDate && (
        <div className="available-slots">
          <h3>
            Slobodni termini {/*za {selectedDate.toLocaleDateString("sr-RS")}*/}
          </h3>

          {loading && <p className="loading-message">Učitavanje...</p>}

          {error && <p className="error">{error}</p>}

          {!loading && !error && availableSlots.length === 0 && (
            <p className="no-slots">
              Nema slobodnih termina za izabrani datum.
            </p>
          )}

          {!loading && !error && availableSlots.length > 0 && (
            <div>
              <div className="slots-list">
                {availableSlots.map((slot, index) => (
                  <div
                    key={index}
                    className={`slot-item ${selectedSlot === index ? "selected" : ""}`}
                    onClick={() => setSelectedSlot(index)}
                  >
                    <span className="time">
                      {slot.start_time.slice(0, 5)} -{" "}
                      {slot.end_time.slice(0, 5)}
                    </span>
                    <span className="availability">
                      Dostupno: {slot.available_devices}/{slot.total_devices}
                    </span>
                  </div>
                ))}
              </div>
              <button
                className="btn-reserve"
                disabled={selectedSlot === null || reserving}
                onClick={handleReservation}
              >
                {reserving ? "Rezerviše se..." : "Rezerviši"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SelectionDate;
