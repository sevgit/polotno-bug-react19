import { WorkspaceCanvas } from "polotno/canvas/workspace-canvas";
import type { StoreType } from "polotno/model/store";
import "./components/DSPlaceholderElement";
import "./components/DSVariableFieldListElement";
import { ThemeProvider, useTheme } from "@mui/material";

type AppProps = {
	store: StoreType;
};

export const App = ({ store }: AppProps) => {
	const theme = useTheme();

	return (
		<ThemeProvider theme={theme}>
			<WorkspaceCanvas
				store={store}
				visiblePagesOffset={0}
				renderOnlyActivePage={true}
				components={{
					PageControls: null,
					Tooltip: null,
				}}
			/>
		</ThemeProvider>
	);
};
