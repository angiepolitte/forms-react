import React, { useEffect } from "react";
import "./App.css";
import { useForm } from "react-hook-form";

function App() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    validate,
  } = useForm({
    mode: "onChange",
  });
  const existingUsernames = ["admin", "user123", "john"];
  const checkIfUsernameExist = async (username) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return existingUsernames.includes(username);
  };

  const onSubmit = (data) => {
    console.log(data);
    reset();
  };

  const validateName = (value) => {
    if (value !== "admin") {
      return "Only admin is allowed";
    }
    return true;
  };

  return (
    <div>
      <h1>Forms in React</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          Name:{" "}
          {/* <input {...register("name", { required: true, minLength: 2 })} /> */}
          <input
            {...register("name", {
              required: true,
              minLength: {
                value: 2,
                message: "Name should be at least 2 chars",
              },
              // validate: validateName,
              validate: {
                notAdmin: (value) =>
                  value !== "admin" || "Admin is not allowed",
                isNotNumber: (value) =>
                  isNaN(value) || "Name cannot be a number",
                checkUsername: async (value) => {
                  const exist = await checkIfUsernameExist(value);
                  return !exist || "Username already taken";
                },
              },
            })}
          />
        </label>
        {errors.name && <p>{errors.name.message}</p>}

        <label>
          Email:
          <input
            {...register("email", {
              required: true,
              pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            })}
          />
        </label>
        {errors.email && <p>Email is required</p>}

        <label>
          Password:
          <input
            type="password"
            {...register("password", {
              required: true,
              minLength: 2,
            })}
          ></input>
        </label>
        {errors.password && <p>{errors.password.message}</p>}
        <label>
          Confirm Password:
          <input
            type="password"
            {...register("confirmPassword", {
              required: true,
              minLength: 2,
              validate: (value) =>
                value === watch("password") || "Passwords do not match",
            })}
          ></input>
        </label>
        {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
        <br />
        <button type="submit">Submit</button>
        <button type="button" onClick={() => reset()}>
          Reset
        </button>
      </form>
    </div>
  );
}

export default App;
