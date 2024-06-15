"use client";

import { FaTrash } from "react-icons/fa";
import { Button, H2 } from "../../base";
import { Task } from "../../../types";
import { colors } from "../../../styles/colors";
import { CSSProperties, useState } from "react";
import { deleteTask, getAllTasks } from "../../../api/task/taskService";
import { useDashboardContext } from "../../../contexts";

type HomeTaskTableProps = {
  tasks: Task[];
};

export default function HomeTaskTable(props: HomeTaskTableProps) {
  const { tasks: propTasks } = props;
  const { showToast } = useDashboardContext();

  const [tasks, setTasks] = useState<Task[]>(propTasks);

  const totalTasks = tasks.length;
  const overdueTasks = tasks.filter((task) => new Date(task.date) < new Date()).length;

  const handleDeleteTaskClick = async (id: string) => {
    const res = await deleteTask(id);

    if (res.deletedCount === 1) {
      showToast({
        title: "Success",
        message: "Task deleted",
        type: "success",
      });
      getAllTasks().then((tasks) => {
        const castedTasks = JSON.parse(tasks) as Task[];
        setTasks(castedTasks);
      });
    } else {
      showToast({
        title: "Error",
        message: "Task could not be deleted",
        type: "error",
      });
    }
  };

  return (
    <div className="greedyContainer colContainer">
      <H2>HomeTaskTable</H2>

      <div
        className="rowContainer"
        style={{
          justifyContent: "space-around",
          textDecoration: "underline",
          width: "80%",
        }}
      >
        <div>
          <span>Total: </span>
          <span>{`${totalTasks}`}</span>
        </div>
        <div>
          <span>Overdue: </span>
          <span style={{ color: colors.prioirtyColors.danger }}>{`${overdueTasks}`}</span>
        </div>
      </div>

      <div className="greedyContainer" style={{ overflowY: "auto", width: "95%" }}>
        <table className="basicBorder greedyContainer" style={{ width: "100%" }}>
          <tbody>
            {tasks.map((task, i) => {
              const key = i + task?._id?.toString();

              const taskDate = new Date(task.date);

              const dateStyle: CSSProperties = {
                color:
                  taskDate < new Date() ? colors.prioirtyColors.danger : colors.white,
              };

              const displayDate = new Date(task.date).toLocaleDateString();

              const tdStyle: CSSProperties = { textAlign: "center" };

              const tdWidth: Record<string, CSSProperties> = {
                description: { width: "40%" },
                date: { width: "30%" },
                delete: { width: "20%" },
              };

              return (
                <tr
                  className="basicBorder"
                  key={key}
                  style={{
                    height: "5rem",
                  }}
                >
                  <td style={{ ...tdStyle,  ...tdWidth.description }}>{task.task} </td>
                  <td style={{ ...dateStyle, ...tdStyle, ...tdWidth.date }}>
                    {displayDate}
                  </td>
                  <td style={{ ...tdStyle, ...tdWidth.delete }}>
                    <Button
                      child={<FaTrash />}
                      theme="none"
                      onClick={() => handleDeleteTaskClick(task._id.toString())}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
