"use client";

import { useState } from "react";
import { useUserContext } from "../../../contexts";
import { saveUser } from "../../../service/user/userService";
import { User } from "../../../types";
import { useLoadingContext } from "../../../contexts/LoadingContext";

export default function WeatherOptionsMenu() {
  const { setLoading } = useLoadingContext();

  const { user } = useUserContext();

  const [enableWeather, setEnableWeather] = useState(userHasCoords(user));

  const handleEnableWeatherClick = async () => {
    setLoading(true);
    if (!enableWeather) {
      await enableWeatherService();
    } else {
      await disableWeatherService();
    }
  };

  const enableWeatherService = async () => {
    const geolocator = navigator.geolocation;
    if (geolocator) {
      const success = async (position: GeolocationPosition) => {
        user.settings.userCoords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };

        await saveUser(JSON.stringify(user)).then((res) => {
          const resUser = JSON.parse(res) as User;
          setEnableWeather(userHasCoords(resUser as User));
        });

        //Prevent the loading state from flashing
        setTimeout(() => {
          setLoading(false);
        }, 250);
      };

      const error = (error: GeolocationPositionError) => {
        //TODO remove in favor of toast
        console.log(error);
      };
      geolocator.getCurrentPosition(success, error);
    }
  };

  const disableWeatherService = async () => {
    user.settings.userCoords = null;

    await saveUser(JSON.stringify(user)).then((res) => {
      const resUser = JSON.parse(res) as User;
      setEnableWeather(userHasCoords(resUser as User));
    });

    //Prevent the loading state from flashing
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  return (
    <div
      className="row-container gap-1 basic-border"
      style={{
        width: "100%",
        padding: "1rem",
      }}
    >
      <label className="text-nowrap" htmlFor="enableWeatherCheckbox">
        Enable forecast
      </label>
      <input
        name="enableWeatherCheckbox"
        className="db-checkbox"
        type="checkbox"
        checked={enableWeather}
        onChange={handleEnableWeatherClick}
      />
    </div>
  );
}

const userHasCoords = (user: User) => {
  return user.settings.userCoords !== null;
};
