import { useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Tab from "react-bootstrap/Tab";
import {
  Gear,
  LayoutTextSidebar,
  PersonFill,
  Send,
  Wallet2,
} from "react-bootstrap-icons";

import Configuration from "./windows/Configuration";
import Profile from "./windows/Profile";
import Wallet from "./windows/Wallet";
import Bizum from "./windows/bizum/Bizum";
import History from "./windows/history/History";

/**
 * Pestanas del panel. Cada una declara su propio componente; los datos los pide
 * el componente con sus hooks. Antes el panel cargaba de golpe el historial de
 * intercambios, el de pagos, el de bizums y el listado de usuarios nada mas
 * entrar, aunque la pestana visible fuese la de perfil.
 */
const TABS = [
  { key: "perfil", label: "Perfil", title: "Perfil", icon: PersonFill },
  { key: "cartera", label: "Cartera", title: "Cartera", icon: Wallet2 },
  {
    key: "historial",
    label: "Historial",
    title: "Historial",
    icon: LayoutTextSidebar,
  },
  { key: "bizum", label: "Bizum", title: "Bizum", icon: Send },
  { key: "ajustes", label: "Ajustes", title: "Configuración", icon: Gear },
];

export default function Dashboard() {
  const [activeKey, setActiveKey] = useState(TABS[0].key);

  const activeTab = TABS.find((tab) => tab.key === activeKey) ?? TABS[0];

  return (
    <div className="container">
      <section className="card my-4">
        <h1 className="text-center">Panel de control</h1>
      </section>

      <Tab.Container
        id="dashboard-tabs"
        activeKey={activeKey}
        onSelect={(key) => setActiveKey(key ?? TABS[0].key)}
        // El contenido de una pestana no se monta hasta que se abre, asi que
        // sus consultas tampoco se lanzan antes de tiempo. Una vez abierta se
        // queda montada, para no volver a pedir lo mismo al ir y venir.
        mountOnEnter
      >
        <section className="row align-items-start">
          <aside className="col-md-3 col-12 mb-4">
            <ListGroup>
              {TABS.map(({ key, label, icon: Icon }) => (
                <ListGroup.Item
                  key={key}
                  action
                  type="button"
                  eventKey={key}
                  className="d-flex align-items-center"
                >
                  <Icon className="me-3" /> {label}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </aside>
          <main className="col-md-9 col-12 mb-3">
            <div className="card">
              <div className="card-header text-center">{activeTab.title}</div>
              <Tab.Content>
                <Tab.Pane eventKey="perfil">
                  <Profile />
                </Tab.Pane>
                <Tab.Pane eventKey="cartera">
                  <Wallet />
                </Tab.Pane>
                <Tab.Pane eventKey="historial">
                  <History />
                </Tab.Pane>
                <Tab.Pane eventKey="bizum">
                  <Bizum />
                </Tab.Pane>
                <Tab.Pane eventKey="ajustes">
                  <Configuration />
                </Tab.Pane>
              </Tab.Content>
            </div>
          </main>
        </section>
      </Tab.Container>
    </div>
  );
}
