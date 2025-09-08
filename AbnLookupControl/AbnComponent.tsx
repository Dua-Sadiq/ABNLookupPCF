import * as React from "react";

export interface CompanySearchResult {
    Name: string;
    Abn: string;
    Postcode?: string;
    State?: string;
}

export interface IAbnProps {
    abnInput: string;
    onAbnChange: (value: string) => void;
    businessName: string;
    postCode: string;
    state: string;
    acn: string;
    abn: string;
    searchResults: CompanySearchResult[];
    dropdownOpen: boolean;
    onResultSelect: (result: CompanySearchResult) => void;
}

export const AbnComponent: React.FC<IAbnProps> = (props) => {
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    // Close dropdown if user clicks outside
    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                if (props.dropdownOpen) {
                    props.onResultSelect({} as CompanySearchResult); // Close dropdown with no selection
                }
            }
        }
        if (props.dropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [props.dropdownOpen, props.onResultSelect]);

    return (
        <div style={{ width: "100%" }}>
            <input
                type="text"
                value={props.abnInput}
                onChange={(e) => props.onAbnChange(e.target.value)}
                style={{
                    width: "100%",
                    height: "40px",
                    padding: "8px 12px",
                    fontSize: "14px",
                    border: "2px solid #ced4da",
                    borderRadius: "6px",
                    outline: "none",
                    transition: "border-color 0.2s ease",
                    boxSizing: "border-box"
                }}
                placeholder="Enter company name to search..."
            />
            {props.dropdownOpen && props.searchResults.length > 0 && (
                <div
                    ref={dropdownRef}
                    style={{
                        marginTop: "2px",
                        width: "100%",
                        background: "#fff",
                        border: "1px solid #ced4da",
                        borderRadius: "0 0 6px 6px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        zIndex: 10,
                        maxHeight: "200px",
                        overflowY: "auto",
                        position: "static"
                    }}
                >
                    {props.searchResults.map((result, idx) => (
                        <div
                            key={idx}
                            onClick={() => props.onResultSelect(result)}
                            style={{
                                padding: "10px 12px",
                                cursor: "pointer",
                                borderBottom: idx !== props.searchResults.length - 1 ? "1px solid #f1f1f1" : undefined,
                                background: "#fff"
                            }}
                            onMouseDown={e => e.preventDefault()}
                        >
                            <div style={{ fontWeight: 500 }}>{result.Name}</div>
                            <div style={{ fontSize: "12px", color: "#888" }}>{result.Abn}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
