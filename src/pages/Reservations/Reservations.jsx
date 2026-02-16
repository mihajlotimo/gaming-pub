import React, { useEffect, useState } from "react";
import "./Reservations.css";
import Modal from "../../components/Modal/Modal";
const API_URL = import.meta.env.VITE_API_URL;

const Reservations = ({ user }) => {
  const [reservations, setReservations] = useState([]);
  const [setups, setSetups] = useState([]);
  const [confirmationDelete, setConfirmationDelete] = useState(false);
  const [reservationId, setReservationId] = useState(null);

  const fetchReservations = async () => {
    try {
      const response = await fetch(
        `${API_URL}/reservations/user/${user.user_id}`,
      );
      const data = await response.json();
      setReservations(data);
    } catch (err) {
      console.error("Error fetching reservations: " + err.message);
    }
  };

  const fetchSetups = async () => {
    try {
      const response = await fetch(`${API_URL}/setups`);
      const data = await response.json();
      setSetups(data);
    } catch (err) {
      console.error("Error fetching setups: " + err.message);
    }
  };

  useEffect(() => {
    fetchReservations();
    fetchSetups();
  }, []);

  const calculateEndTime = (startTime, durationHours) => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const endHours = hours + durationHours;

    return `${String(endHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };

  const cancelReservation = async (resId) => {
    try {
      const response = await fetch(`${API_URL}/reservations/${resId}/cancel`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Greska pri otkazivanju rezervacije!",
        );
      }
      const data = await response.json();

      await fetchReservations();

      alert("Rezervacija uspešno otkazana!");
    } catch (err) {
      console.error("Error canceling reservation: " + err.message);
    }
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div>
      <h2 className="title-reservations">Moji termini</h2>
      {!reservations.find((r) => r.status === "active") ? (
        <p className="no-reservations">Nemate nijednu rezervaciju.</p>
      ) : (
        <div className="reservations-list">
          {reservations.map(
            (reservation) =>
              reservation.reservation_date > new Date().toISOString() &&
              reservation.status === "active" && (
                <div
                  key={reservation.reservation_id}
                  className="reservation-item"
                >
                  <p>Rezervacija za: {reservation.setup_name}</p>
                  <p>
                    Datum: {formatDate(new Date(reservation.reservation_date))}
                  </p>
                  <p>
                    Vreme: {reservation.start_time.slice(0, 5)} -{" "}
                    {calculateEndTime(
                      reservation.start_time,
                      reservation.duration_hours,
                    )}
                  </p>
                  <button
                    className="btn-cancel"
                    onClick={() => {
                      setConfirmationDelete(true);
                      setReservationId(reservation.reservation_id);
                    }}
                  >
                    Otkaži
                  </button>
                </div>
              ),
          )}
        </div>
      )}
      {confirmationDelete && (
        <Modal
          question={"Da li ste sigurni da želite da otkažete rezervaciju?"}
          onCancel={() => setConfirmationDelete(false)}
          onConfirm={() => {
            setConfirmationDelete(false);
            cancelReservation(reservationId);
          }}
        />
      )}
    </div>
  );
};

export default Reservations;
