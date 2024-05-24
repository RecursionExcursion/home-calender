"use client";

import React, { use, useEffect } from "react";
import { Task } from "../../_types/models/task";
import { getDateAndTime } from "../admin/util";

type TaskListProps = {
  tasks: Task[];
};
export const TaskList = (props: TaskListProps) => {
  const { tasks } = props;

  const divAreaRef = React.useRef<HTMLDivElement>(null);
  const [scrollIndex, setScrollIndex] = React.useState<number>(0);

  const scroll = async () => {
    if (divAreaRef.current === null) {
      throw new Error("scrollHeight is undefined");
    }

    const divAreaHeight = divAreaRef.current.clientHeight;
    const scrollHeight = divAreaRef.current.scrollHeight;

    if (divAreaHeight >= scrollHeight) return;

    const scrollToHeight = divAreaRef.current.scrollHeight - divAreaHeight + 10;

    setTimeout(() => {
      divAreaRef.current?.scrollTo({
        top: scrollIndex + 1,
        behavior: "smooth",
      });

      setScrollIndex((prev) => {
        const newIndex = prev === scrollToHeight ? 0 : scrollIndex + 1;
        return newIndex;
      });
    }, 100);
  };

  useEffect(() => {
    if (tasks.length > 0) scroll();
  }, [scrollIndex]);

  return (
    <div className="  text-black flex flex-col items-center rounded-lg w-full h-full overflow-hidden p-2">
      <h3 className="flex justify-center font-semibold text-lg bg-slate-300 w-full rounded-md rounded-b-none">
        Tasks
      </h3>
      <div
        ref={divAreaRef}
        className="w-full h-full resize-none overflow-hidden rounded-md rounded-t-none bg-white"
        style={{ scrollBehavior: "smooth" }}
      >
        {tasks
          .sort((a, b) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          })
          .map((t) => (
            <TaskDiv key={t._id.toString()} task={t} />
          ))}
      </div>
    </div>
  );
};

type TaskDivProps = {
  task: Task;
};

const TaskDiv = (props: TaskDivProps) => {
  const { task } = props;

  const { time } = getDateAndTime(new Date(task.date));

  const priorityColorsMap = new Map<number, string>([
    [0, "bg-white"],
    [1, "bg-green-500"],
    [2, "bg-yellow-500"],
    [3, "bg-red-500"],
  ]);

  const prio = task.priority;
  const color = priorityColorsMap.get(prio);

  const wrapperStyle = `flex text-nowrap ${color}`;

  return (
    <div className={wrapperStyle}>
      <div className="flex flex-1 justify-center">{task.task}</div>
      <div className="flex flex-1 justify-center">{time}</div>
    </div>
  );
};

// export const TaskList = (props: TaskListProps) => {
//   const { tasks } = props;

//   const textareaRef = React.useRef<HTMLTextAreaElement>(null);
//   const [scrollIndex, setScrollIndex] = React.useState<number>(0);

//   let x: number = 0;

//   const scroll = async () => {
//     if (textareaRef.current === null) {
//       throw new Error("scrollHeight is undefined");
//     }

//     /* Needs to be ~-80 to account for the hight of the textarea itself
//      * This needs to be around the height of the textarea
//      * Lower number will make the scrolling hang at the bottom
//      */
//     const textAreaHeight = textareaRef.current.clientHeight;
//     const scrollHeight = textareaRef.current.scrollHeight - textAreaHeight + 10;

//     setTimeout(() => {
//       textareaRef.current?.scrollTo({
//         top: scrollIndex + 1,
//         behavior: "smooth",
//       });

//       setScrollIndex((prev) => {
//         const newIndex = prev === scrollHeight ? 0 : scrollIndex + 1;
//         return newIndex;
//       });
//     }, 100);
//   };

//   useEffect(() => {
//     if (tasks.length > 0) scroll();
//   }, [scrollIndex]);

//   return (
//     <div className="  text-black flex flex-col items-center rounded-lg w-full h-full overflow-hidden p-2">
//       <h3 className="flex justify-center font-semibold text-lg bg-white w-full rounded-md rounded-b-none">
//         Tasks
//       </h3>
//       <textarea
//         ref={textareaRef}
//         className="w-full h-full resize-none overflow-hidden pl-2 rounded-md rounded-t-none"
//         value={tasks.map((t) => t.task).join("\n")}
//         readOnly
//         style={{ scrollBehavior: "smooth" }}
//       />
//     </div>
//   );
// };
